package com.voicemed.appsdk;

import android.Manifest;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MicrophoneInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import android.util.Pair;
import android.webkit.ValueCallback;
import android.webkit.WebView;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.PermissionState;
import com.voicemed.appsdk.httputils.APIAccessTask;
import com.voicemed.appsdk.httputils.APIResponseObject;
import com.voicemed.appsdk.recorder.CurrentRecordingStatus;
import com.voicemed.appsdk.recorder.CustomMediaRecorder;
import com.voicemed.appsdk.recorder.RecordData;
import com.voicemed.appsdk.recorder.ResponseGenerator;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import static com.voicemed.appsdk.recorder.Messages.ALREADY_RECORDING;
import static com.voicemed.appsdk.recorder.Messages.CANNOT_RECORD_ON_THIS_PHONE;
import static com.voicemed.appsdk.recorder.Messages.FAILED_TO_FETCH_RECORDING;
import static com.voicemed.appsdk.recorder.Messages.FAILED_TO_RECORD;
import static com.voicemed.appsdk.recorder.Messages.MICROPHONE_BEING_USED;
import static com.voicemed.appsdk.recorder.Messages.MISSING_PERMISSION;
import static com.voicemed.appsdk.recorder.Messages.RECORDING_HAS_NOT_STARTED;


import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;


@CapacitorPlugin(name = "Voicemed", permissions = {@Permission(alias = VoicemedPlugin.RECORD_AUDIO_ALIAS, strings = {Manifest.permission.RECORD_AUDIO}), @Permission(alias = "storage", strings = {Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE})}

)
public class VoicemedPlugin extends Plugin {

    static final String RECORD_AUDIO_ALIAS = "voice recording";
    private CustomMediaRecorder mediaRecorder;
    private int previousVolume = -1;
    private int previousVcalVolume = -1;

    private Preferences preferences;
    private String appKey = "";
    private String environment = "";

    private String appUrl = "";
    private String currentUrl = "";

    static final String _stagingUrl = "https://sandbox-api-2.voicemed.io/";
    static final String _prodUrl = "https://api-2.voicemed.io/";
    static final String API_authenticationSuffix = "v2/auth/login";
    static final String API_listProgramsSuffix = "v2/user/programs";
    static final String API_completeExerciseSuffix = "v2/user/breathing_exercises";



    @Override
    public void load() {
        preferences = new Preferences(getContext(), PreferencesConfiguration.DEFAULTS);

        this.appKey = getConfig().getString("appKey", "").trim();
        this.environment = getConfig().getString("environment", "staging").trim();

        if (this.appKey.length() < 1) {
            Log.e("VOICEMED", "appKey config is mandatory");
        }
        if (!this.environment.equals("production") && !this.environment.equals("staging")) {
            Log.e("VOICEMED", "Environment not recognized, apply default: staging");
            this.environment = "staging";
        }

        if (this.environment.equals("staging")) {
            this.appUrl = _stagingUrl;
        } else if (this.environment.equals("production")) {
            this.appUrl = _prodUrl;
        }
    }

    @PluginMethod()
    public void getEnvironment(PluginCall call) {
        JSObject jData = new JSObject();
        jData.put("environment",this.environment);
        call.resolve(jData);
    }
    @PluginMethod()
    public void setEnvironment(PluginCall call) {
        String _newEnv = call.getString("environment","");
         if (!_newEnv.equals("production") && !_newEnv.equals("staging")) {
            Log.e("VOICEMED", "Environment not recognized, apply default: staging");
            call.reject("Available environment are staging and production");
            return;
        }
        this.environment = _newEnv;
        if (this.environment.equals("staging")) {
            this.appUrl = _stagingUrl;
        } else if (this.environment.equals("production")) {
            this.appUrl = _prodUrl;
        }
        call.resolve();
    }

    @PluginMethod()
    public void logout(PluginCall call) {
        preferences.clear();
        call.resolve();
    }

    @PluginMethod()
    public void fillUserData(PluginCall call) {
        String _currentData = preferences.get("userdata");
        String token = preferences.get("token");
        if (StringIsEmpty(token)) {
            call.reject("Token must be valid, please ensure you have completed the authenticateUser method");
        }
        if(StringIsEmpty(_currentData)) {
            call.reject("No data for this user");
        }
        try {
            JSObject jData = new JSObject(_currentData);
            call.resolve(jData);
        }catch (JSONException e) {
            call.reject("No data for this user");
        }
    }
    @PluginMethod()
    public void authenticateUser(PluginCall call) {
        String value = call.getString("externalID");
        if (StringIsEmpty(value)) {
            call.reject("ExternalID must be filled");
        }
        JSObject _meta = call.getObject("usermeta");
        String finalURL = appUrl + API_authenticationSuffix;
        //Build params:
        List<Pair<String, String>> _postData = new ArrayList<>();
        _postData.add(new Pair<>("externalId", value));
        List<Pair<String, String>> _headerData = new ArrayList<>();
        _headerData.add(new Pair<>("api-key", appKey));
        _headerData.add(new Pair<>("Content-Type", "application/x-www-form-urlencoded"));

        if (_meta != null) {
            _postData.add(new Pair<>("meta", _meta.toString()));
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                new APIAccessTask(getContext(), finalURL, "POST", _postData, _headerData, new APIAccessTask.OnCompleteListener() {
                    @Override
                    public void onComplete(APIResponseObject result) {
                        if (result.responseCode >= 200 && result.responseCode <= 202) {
                            try {
                                JSObject jRes = new JSObject(result.response);
                                if (jRes.has("access_token")) {
                                    String token = jRes.getString("access_token");
                                    preferences.set("token", token);
                                    JSObject _eventData = new JSObject();
                                    _eventData.put("currentToken", token);
                                    _eventData.put("id", value);
                                    if (_meta != null) {
                                        _eventData.put("meta", _meta);
                                    }
                                    preferences.set("userdata",_eventData.toString());
                                    notifyListeners("airlynUpdateUserData", _eventData);
                                }
                                call.resolve(jRes);
                            } catch (Throwable t) {
                                call.reject("Something went wrong");
                            }
                        } else {
                            call.reject("something went wrong");
                        }
                    }
                }).execute();
            }
        }).start();
    }

    private boolean StringIsEmpty(String tmp) {
        if (tmp != null && !tmp.isEmpty() && !tmp.equals("null")) {
            return false;
        }
        return true;
    }

    @PluginMethod()
    public void listExercises(PluginCall call) {
        Boolean full = call.getBoolean("full", true);
        String token = call.getString("token", preferences.get("token"));
        if (StringIsEmpty(token)) {
            token = preferences.get("token");
        }
        if (StringIsEmpty(token)) {
            call.reject("Token must be valid, please ensure you have completed the authenticateUser method");
        }
        String finalURL = appUrl + API_listProgramsSuffix;

        String finalToken = token;
        new Thread(new Runnable() {
            @Override
            public void run() {
                String response = "";
                HttpURLConnection conn = null;
                try {
                    URL url = new URL(finalURL);
                    conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("Content-length", "0");
                    conn.setUseCaches(false);
                    conn.setAllowUserInteraction(false);
                    conn.setRequestProperty("api-key", appKey);
                    conn.setRequestProperty("Authorization", "Bearer " + finalToken);
                    conn.connect();
                    int status = conn.getResponseCode();
                    switch (status) {
                        case 200:
                        case 201:
                            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                            StringBuilder sb = new StringBuilder();
                            String line;
                            while ((line = br.readLine()) != null) {
                                sb.append(line + "\n");
                            }
                            br.close();
                            response = sb.toString();
                    }
                } catch (MalformedURLException ex) {
                    call.reject("Authorization, malformed url");

                } catch (IOException ex) {
                    call.reject("Something went wrong");
                } finally {
                    if (conn != null) {
                        try {
                            conn.disconnect();
                        } catch (Exception ex) {
                            call.reject("Something went wrong");
                        }
                    }
                }
                //String to json :
                if (!StringIsEmpty(response)) {
                    ArrayList<JSObject> jChallenges = new ArrayList<JSObject>();
                    try {
                        JSArray jRes = new JSArray(response);
                        List<JSONObject> _lista = jRes.toList();
                        for (JSONObject _challenge : _lista) {
                            String _id = _challenge.optString("_id", "");
                            if (!StringIsEmpty(_id)) {
                                JSObject _newChallenge = getChallenge(_id, finalToken);
                                if (!_newChallenge.equals(null)) {
                                    jChallenges.add(_newChallenge);
                                } else {
                                    jChallenges.add(new JSObject(_challenge.toString()));
                                }
                            }
                        }
                    } catch (Throwable t) {
                        call.reject("Something went wrong");
                    }
                    if (jChallenges.size() > 0) {
                        JSArray _finalList = new JSArray(jChallenges);
                        JSObject res = new JSObject();
                        res.put("challenges", _finalList);
                        call.resolve(res);
                    } else {
                        call.reject("Error");
                    }
                } else {
                    call.reject("Something went wrong");
                }
            }
        }).start();

    }

    private JSObject getChallenge(String challengeID, String token) {
        String finalURL = appUrl + API_listProgramsSuffix + "/" + challengeID;
        String response = "";
        HttpURLConnection conn = null;
        try {
            URL url = new URL(finalURL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-length", "0");
            conn.setUseCaches(false);
            conn.setAllowUserInteraction(false);
            conn.setRequestProperty("api-key", appKey);
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.connect();
            int status = conn.getResponseCode();
            switch (status) {
                case 200:
                case 201:
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line + "\n");
                    }
                    br.close();
                    response = sb.toString();
            }
        } catch (MalformedURLException ex) {
            return null;

        } catch (IOException ex) {
            return null;
        } finally {
            if (conn != null) {
                try {
                    conn.disconnect();
                } catch (Exception ex) {
                    return null;
                }
            }
        }
        //String to json :
        if (!StringIsEmpty(response)) {
            try {
                JSObject jRes = new JSObject(response);
                return jRes;
            } catch (Throwable t) {
                return null;
            }
        } else {
            return null;
        }
    }

    @PluginMethod()
    public void startExercise(PluginCall call) {
        String token = call.getString("token", "");
        String _id = call.getString("id", "");
        String _program_id = call.getString("program_id", "");
        int _program_index = call.getInt("program_index", 0);

        if (StringIsEmpty(token)) {
            token = preferences.get("token");
        }

        if (StringIsEmpty(token)) {
            call.reject("Token must be valid, please ensure you have completed the authenticateUser method");
        }
        if (StringIsEmpty(_id)) {
            call.reject("Exercise ID must be valid");
            return;
        }
        if (StringIsEmpty(_program_id)) {
            call.reject("Program ID must be valid");
            return;
        }
        if (_program_index < 0) {
            call.reject("Program Index must be valid");
            return;
        }
        String finalToken = token;
        getBridge().executeOnMainThread(new Runnable() {
            @Override
            public void run() {

                Locale current = getActivity().getResources().getConfiguration().locale;
                String baseURL = getBridge().getLocalUrl();
                if (StringIsEmpty(baseURL)) {
                    baseURL = getBridge().getServerUrl();
                }
                WebView w = getBridge().getWebView();
                w.evaluateJavascript("document.location", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        currentUrl = value;
                    }
                });
                String _final = baseURL + "/voicemed-sdk/index.html?id=" + _id + "&pid=" + _program_id + "&px=" + _program_index+"&locale="+current.getLanguage();
                JSObject _jsonData = new JSObject();
                _jsonData.put("exercise_id", _id);
                _jsonData.put("program_id", _program_id);
                _jsonData.put("program_index", _program_index);
                String json = _jsonData.toString();
                String initCommand = "window.currentExerciseURL='" + _final + "';window.currentExercise=" + json + ";window.currentVMToken='" + finalToken + "';window.currentVMKey='" + appKey + "';window.currentVMUrl='" + appUrl + "';";
                String finalCommand = """
                        if(document.getElementById("vmiframe_handler")) {
                            document.getElementById("vmiframe_handler").remove();
                        }
                        window.capacitorHandler = Capacitor;
                        window.voiceMedHandler  = Capacitor.Plugins.Voicemed;
                        window.deviceHandler  = Capacitor.Plugins.Device;
                        window.browserHandler  = Capacitor.Plugins.Browser;
                        window.localKeyboard  = Capacitor.Plugins.Keyboard;
                        window.localDialog  = Capacitor.Plugins.Dialog;
                        window.iFrameVM = document.createElement("IFRAME");
                        iFrameVM.id = "vmiframe_handler";
                        iFrameVM.classList.add('vmiframe_handler');
                        iFrameVM.style.position='absolute';
                        iFrameVM.style.left='0px';
                        iFrameVM.style.top='0px';
                        iFrameVM.style.width='100vw';
                        iFrameVM.style.height='100vh';
                        iFrameVM.style.zIndex=99999;
                        iFrameVM.src = window.currentExerciseURL;
                        document.querySelector('body').appendChild(iFrameVM);
                        """;
                w.evaluateJavascript(initCommand + finalCommand, new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        Log.d("VOICEMED", "Got set value result" + value);
                    }
                });
                call.resolve(ResponseGenerator.successResponse());
            }
        });
    }


    @PluginMethod()
    public void startChallenge(PluginCall call) {
        String token = call.getString("token", "");
        String _program_id = call.getString("program_id", "");

        if (StringIsEmpty(token)) {
            token = preferences.get("token");
        }

        if (StringIsEmpty(token)) {
            call.reject("Token must be valid, please ensure you have completed the authenticateUser method");
        }
        if (StringIsEmpty(_program_id)) {
            call.reject("Program ID must be valid");
            return;
        }
        String finalToken = token;
        getBridge().executeOnMainThread(new Runnable() {
            @Override
            public void run() {
                Locale current = getActivity().getResources().getConfiguration().locale;


                String baseURL = getBridge().getLocalUrl();
                if (StringIsEmpty(baseURL)) {
                    baseURL = getBridge().getServerUrl();
                }
                WebView w = getBridge().getWebView();
                w.evaluateJavascript("document.location", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        currentUrl = value;
                    }
                });
                String _final = baseURL + "/voicemed-sdk/index.html?pid=" + _program_id + "&pmode=challenge&locale="+current.getLanguage();
                JSObject _jsonData = new JSObject();
                _jsonData.put("command", "challenge");
                _jsonData.put("program_id", _program_id);
                String json = _jsonData.toString();
                String initCommand = "window.currentExerciseURL='" + _final + "';window.currentChallenge=" + json + ";window.currentVMToken='" + finalToken + "';window.currentVMKey='" + appKey + "';window.currentVMUrl='" + appUrl + "';";
                String finalCommand = """
                        if(document.getElementById("vmiframe_handler")) {
                            document.getElementById("vmiframe_handler").remove();
                        }
                        window.capacitorHandler = Capacitor;
                        window.voiceMedHandler  = Capacitor.Plugins.Voicemed;
                        window.deviceHandler  = Capacitor.Plugins.Device;
                        window.browserHandler  = Capacitor.Plugins.Browser;
                        window.localKeyboard  = Capacitor.Plugins.Keyboard;
                        window.localDialog  = Capacitor.Plugins.Dialog;
                        window.iFrameVM = document.createElement("IFRAME");
                        iFrameVM.id = "vmiframe_handler";
                        iFrameVM.classList.add('vmiframe_handler');
                        iFrameVM.style.position='absolute';
                        iFrameVM.style.left='0px';
                        iFrameVM.style.top='0px';
                        iFrameVM.style.width='100vw';
                        iFrameVM.style.height='100vh';
                        iFrameVM.style.zIndex=99999;
                        iFrameVM.src = window.currentExerciseURL;
                        document.querySelector('body').appendChild(iFrameVM);
                        """;
                w.evaluateJavascript(initCommand + finalCommand, new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        Log.d("VOICEMED", "Got set value result" + value);
                    }
                });
                call.resolve(ResponseGenerator.successResponse());
            }
        });
    }


    @PluginMethod()
    public void closeExercise(PluginCall call) {
        getBridge().executeOnMainThread(new Runnable() {
            @Override
            public void run() {
                String closeFullScreenIframe = """
                        if(document.getElementById("vmiframe_handler")) {
                            document.getElementById("vmiframe_handler").remove();
                        }
                        """;
                WebView w = getBridge().getWebView();
                w.evaluateJavascript(closeFullScreenIframe, new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        Log.d("VOICEMED", "Finito" + value);
                    }
                });
                call.resolve(ResponseGenerator.successResponse());
            }
        });
    }

    @PluginMethod()
    public void finishExercise(PluginCall call) {
        notifyListeners("finishedExercise", call.getData());
    }
    @PluginMethod()
    public void finishChallenge(PluginCall call) {
        notifyListeners("finishedChallenge", call.getData());
    }

    @PluginMethod()
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void openAppStore(PluginCall call) {
        String packageName = this.getContext().getPackageName();
        Intent launchIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + packageName));
        try {
            this.getBridge().getActivity().startActivity(launchIntent);
        } catch (ActivityNotFoundException ex) {
            launchIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + packageName));
            this.getBridge().getActivity().startActivity(launchIntent);
        }
        call.resolve();
    }

    @PluginMethod()
    public void checkCameraPerm(PluginCall call) {

        call.reject("Camera not allowed");
        return;
    /*
        Log.d("VOICEMED", "permissionState[camera]: " + getPermissionState("camera"));
        if (getPermissionState("camera") != PermissionState.GRANTED) {
          requestPermissionForAlias("camera", call, "cameraPermsCallback");
        } else {
          JSObject ret = new JSObject();
          ret.put("result", true);
          call.resolve(ret);
        }
     */
    }

    @PluginMethod()
    public void maxVolume(PluginCall call) {
        boolean set = false;
        try {
            AudioManager am = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
            previousVolume = am.getStreamVolume(AudioManager.STREAM_MUSIC);
            previousVcalVolume = am.getStreamVolume(AudioManager.STREAM_VOICE_CALL);
            am.setStreamVolume(AudioManager.STREAM_MUSIC, am.getStreamMaxVolume(AudioManager.STREAM_MUSIC), 0);
            am.setStreamVolume(AudioManager.STREAM_VOICE_CALL, am.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL), 0);
            set = true;
        } catch (Exception ex) {
            set = false;
            Log.e("VOICEMED", ex.getMessage());
        }
        JSObject ret = new JSObject();
        ret.put("result", set);
        ret.put("previousStreamVolume", previousVolume);
        ret.put("previousVoiceVolume", previousVcalVolume);
        call.resolve(ret);
    }

    @PluginMethod()
    public void revertVolume(PluginCall call) {
        if (previousVolume < 0) {
            call.reject("no prev volume");
        }
        if (previousVcalVolume < 0) {
            call.reject("no prev voice volume");
        }
        boolean set = false;
        try {
            AudioManager am = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
            am.setStreamVolume(AudioManager.STREAM_MUSIC, previousVolume, 0);
            am.setStreamVolume(AudioManager.STREAM_VOICE_CALL, previousVcalVolume, 0);
            set = true;
        } catch (Exception ex) {
            set = false;
            Log.e("VOICEMED", ex.getMessage());
        }
        JSObject ret = new JSObject();
        ret.put("result", set);
        call.resolve(ret);
    }

    @PluginMethod()
    public void openPermissionPanel(PluginCall call) {
        startActivityForResult(call, new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", getContext().getPackageName(), null)), "permissionPanelResult");
    }

    @ActivityCallback()
    public void permissionPanelResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }
        //Forza la richiesta again...
        requestPermissionForAlias(VoicemedPlugin.RECORD_AUDIO_ALIAS, call, "micPermsCallback");
    }

    @PluginMethod()
    public void checkMicPerm(PluginCall call) {
        Log.d("VOICEMED", "permissionState[" + VoicemedPlugin.RECORD_AUDIO_ALIAS + "]: " + getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS));
        if (getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS) == PermissionState.DENIED) {
            JSObject ret = new JSObject();
            ret.put("result", false);
            ret.put("reason", "denied");
            ret.put("state", getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS).toString());
            ret.put("prompt", false);
            call.resolve(ret);
            return;
        }
        if (getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS) != PermissionState.GRANTED) {
            requestPermissionForAlias(VoicemedPlugin.RECORD_AUDIO_ALIAS, call, "micPermsCallback");
        } else {
            JSObject ret = new JSObject();
            ret.put("result", true);
            call.resolve(ret);
        }
    }

    @PluginMethod()
    public void checkWholePermissions(PluginCall call) {
        String[] aliases = new String[2];
        aliases[0] = "storage";
        aliases[1] = VoicemedPlugin.RECORD_AUDIO_ALIAS;
        /*aliases[2] = "camera";*/
        checkPermissions(call);
    }

    @PluginMethod()
    public void requestWholePermissions(PluginCall call) {
        String[] aliases = new String[2];
        aliases[0] = "storage";
        aliases[1] = VoicemedPlugin.RECORD_AUDIO_ALIAS;
        /*aliases[2] = "camera";*/
        requestPermissionForAliases(aliases, call, "wholePermsCallback");
    }

    @PermissionCallback
    private void wholePermsCallback(PluginCall call) {
        boolean camera = false;
        boolean microphone = false;
        boolean storage = false;
        /*
        if (getPermissionState("camera") == PermissionState.GRANTED) {
          camera = true;
        }
         */
        if (getPermissionState("storage") == PermissionState.GRANTED) {
            storage = true;
        }
        if (getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS) == PermissionState.GRANTED) {
            microphone = true;
        }
        JSObject ret = new JSObject();
        //    ret.put("camera", camera);
        ret.put("storage", storage);
        ret.put(VoicemedPlugin.RECORD_AUDIO_ALIAS, microphone);
        call.resolve(ret);
    }


    @PermissionCallback
    private void cameraPermsCallback(PluginCall call) {
        if (getPermissionState("camera") == PermissionState.GRANTED) {
            JSObject ret = new JSObject();
            ret.put("result", true);
            call.resolve(ret);
        } else {
            call.reject("Permission is required to take a pictures");
        }
    }

    @PermissionCallback
    private void micPermsCallback(PluginCall call) {
        if (getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS) == PermissionState.GRANTED) {
            JSObject ret = new JSObject();
            ret.put("result", true);
            call.resolve(ret);
        } else {
            JSObject ret = new JSObject();
            ret.put("result", false);
            ret.put("state", getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS).toString());
            ret.put("reason", getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS) == PermissionState.PROMPT ? "prompt" : "denied");
            ret.put("prompt", false);
            call.resolve(ret);
            call.reject("Permission is required to record Audio");
        }
    }

    /* Audio recorderd zone:*/
    @PluginMethod()
    public void canDeviceVoiceRecord(PluginCall call) {
        if (CustomMediaRecorder.canPhoneCreateMediaRecorder(getContext()))
            call.resolve(ResponseGenerator.successResponse());
        else call.resolve(ResponseGenerator.failResponse());
    }

    @PluginMethod()
    public void requestAudioRecordingPermission(PluginCall call) {
        if (doesUserGaveAudioRecordingPermission()) {
            call.resolve(ResponseGenerator.successResponse());
        } else {
            requestPermissions(call);
        }
    }

    @PermissionCallback
    private void recordAudioPermissionCallback(PluginCall call) {
        if (doesUserGaveAudioRecordingPermission()) {
            call.resolve(ResponseGenerator.successResponse());
        } else {
            call.resolve(ResponseGenerator.failResponse());
        }
    }

    @PluginMethod()
    public void hasAudioRecordingPermission(PluginCall call) {
        call.resolve(ResponseGenerator.fromBoolean(doesUserGaveAudioRecordingPermission()));
    }

    @PluginMethod()
    public void startRecording(PluginCall call) {
        boolean useAGC = call.getBoolean("useAGC", false);


        if (!CustomMediaRecorder.canPhoneCreateMediaRecorder(getContext())) {
            call.reject(CANNOT_RECORD_ON_THIS_PHONE);
            return;
        }

        if (!doesUserGaveAudioRecordingPermission()) {
            call.reject(MISSING_PERMISSION);
            return;
        }

        if (this.isMicrophoneOccupied()) {
            call.reject(MICROPHONE_BEING_USED);
            return;
        }

        if (mediaRecorder != null) {
            call.reject(ALREADY_RECORDING);
            return;
        }

        try {
            mediaRecorder = new CustomMediaRecorder(getContext(), useAGC);
            mediaRecorder.setOnGotDeviceInfoListener(new CustomMediaRecorder.activeMicListener() {
                @Override
                public void onUpdateMic(MicrophoneInfo mic, AudioDeviceInfo info) {
                    JSObject ret = new JSObject();
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        //Position, Description, ID, Type:
                        String micName = "ID: " + mic.getId() + ", Desc: " + mic.getDescription() + ", Address:" + mic.getAddress();
                        if (info != null) {
                            micName = "Name: " + info.getProductName() + ", " + micName;
                        }
                        ret.put("micName", micName);
                        ret.put("micSensitivity", mic.getSensitivity());
                        notifyListeners("airlynUpdateMic", ret);
                    }
                }
            });
            mediaRecorder.setOnUpdateMeterListener(new CustomMediaRecorder.meterListener() {
                @Override
                public void onUpdateMeter(double peakPower, double averagePower) {
                    JSObject ret = new JSObject();
                    ret.put("peakPower", peakPower);
                    ret.put("averagePower", averagePower);
                    notifyListeners("airlynUpdateMeters", ret);
                }
            });
            mediaRecorder.startRecording();
            call.resolve(ResponseGenerator.successResponse());
        } catch (Exception exp) {
            call.reject(FAILED_TO_RECORD, exp);
        }
    }


    @PluginMethod()
    public void stopRecording(PluginCall call) {
        if (mediaRecorder == null) {
            call.reject(RECORDING_HAS_NOT_STARTED);
            return;
        }

        try {
            mediaRecorder.stopRecording();
            File recordedFile = mediaRecorder.getOutputFile();
            RecordData recordData = new RecordData(readRecordedFileAsBase64(recordedFile), getMsDurationOfAudioFile(recordedFile.getAbsolutePath()), "audio/x-wav");
            if (recordData.getRecordDataBase64() == null || recordData.getMsDuration() < 0)
                call.reject(FAILED_TO_FETCH_RECORDING);
            else call.resolve(ResponseGenerator.dataResponse(recordData.toJSObject()));
        } catch (Exception exp) {
            call.reject(FAILED_TO_FETCH_RECORDING, exp);
        } finally {
            mediaRecorder.deleteOutputFile();
            mediaRecorder = null;
        }
    }

    @PluginMethod()
    public void pauseRecording(PluginCall call) {
        if (mediaRecorder == null) {
            call.reject(RECORDING_HAS_NOT_STARTED);
            return;
        }
        try {
            call.resolve(ResponseGenerator.fromBoolean(mediaRecorder.pauseRecording()));
        } catch (Exception exception) {
            call.reject(exception.getMessage());
        }
    }

    @PluginMethod()
    public void resumeRecording(PluginCall call) {
        if (mediaRecorder == null) {
            call.reject(RECORDING_HAS_NOT_STARTED);
            return;
        }
        try {
            call.resolve(ResponseGenerator.fromBoolean(mediaRecorder.resumeRecording()));
        } catch (Exception exception) {
            call.reject(exception.getMessage());
        }
    }

    @PluginMethod()
    public void getCurrentStatus(PluginCall call) {
        if (mediaRecorder == null) {
            call.resolve(ResponseGenerator.statusResponse(CurrentRecordingStatus.NONE));
        } else {
            call.resolve(ResponseGenerator.statusResponse(mediaRecorder.getCurrentStatus()));
        }
    }

    private boolean doesUserGaveAudioRecordingPermission() {
        return getPermissionState(VoicemedPlugin.RECORD_AUDIO_ALIAS).equals(PermissionState.GRANTED);
    }

    private String readRecordedFileAsBase64(File recordedFile) {
        BufferedInputStream bufferedInputStream;
        byte[] bArray = new byte[(int) recordedFile.length()];
        try {
            bufferedInputStream = new BufferedInputStream(new FileInputStream(recordedFile));
            bufferedInputStream.read(bArray);
            bufferedInputStream.close();
        } catch (IOException exp) {
            return null;
        }
        return Base64.encodeToString(bArray, Base64.DEFAULT);
    }

    private int getMsDurationOfAudioFile(String recordedFilePath) {
        try {
            MediaPlayer mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(recordedFilePath);
            mediaPlayer.prepare();
            return mediaPlayer.getDuration();
        } catch (Exception ignore) {
            Log.e("VOICEMED", "Errore get duration" + ignore.getMessage());
            return -1;
        }
    }

    private boolean isMicrophoneOccupied() {
        AudioManager audioManager = (AudioManager) this.getContext().getSystemService(Context.AUDIO_SERVICE);
        if (audioManager == null) return true;
        return audioManager.getMode() != AudioManager.MODE_NORMAL;
    }

    public static void copy(File src, File dst) throws IOException {
        InputStream in = new FileInputStream(src);
        try {
            OutputStream out = new FileOutputStream(dst);
            try {
                // Transfer bytes from in to out
                byte[] buf = new byte[1024];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            } finally {
                out.close();
            }
        } finally {
            in.close();
        }
    }

    /**
     * Preferences
     */
    @PluginMethod
    public void preferenceConfigure(PluginCall call) {
        try {
            PreferencesConfiguration configuration = PreferencesConfiguration.DEFAULTS.clone();
            configuration.group = call.getString("group", PreferencesConfiguration.DEFAULTS.group);

            preferences = new Preferences(getContext(), configuration);

        } catch (CloneNotSupportedException e) {
            call.reject("Error while configuring", e);
            return;
        }
        call.resolve();
    }

    @PluginMethod
    public void preferenceGet(PluginCall call) {
        String key = call.getString("key");
        if (key == null) {
            call.reject("Must provide key");
            return;
        }

        String value = preferences.get(key);

        JSObject ret = new JSObject();
        ret.put("value", value == null ? JSObject.NULL : value);
        call.resolve(ret);
    }

    @PluginMethod
    public void preferenceSet(PluginCall call) {
        String key = call.getString("key");
        if (key == null) {
            call.reject("Must provide key");
            return;
        }

        String value = call.getString("value");
        preferences.set(key, value);

        call.resolve();
    }

    @PluginMethod
    public void preferenceRemove(PluginCall call) {
        String key = call.getString("key");
        if (key == null) {
            call.reject("Must provide key");
            return;
        }

        preferences.remove(key);

        call.resolve();
    }

    @PluginMethod
    public void preferenceKeys(PluginCall call) {
        Set<String> keySet = preferences.keys();
        String[] keys = keySet.toArray(new String[0]);

        JSObject ret = new JSObject();
        try {
            ret.put("keys", new JSArray(keys));
        } catch (JSONException ex) {
            call.reject("Unable to serialize response.", ex);
            return;
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void preferenceClear(PluginCall call) {
        preferences.clear();
        call.resolve();
    }

    @PluginMethod
    public void preferenceMigrate(PluginCall call) {
        List<String> migrated = new ArrayList<>();
        List<String> existing = new ArrayList<>();
        Preferences oldPreferences = new Preferences(getContext(), PreferencesConfiguration.DEFAULTS);

        for (String key : oldPreferences.keys()) {
            String value = oldPreferences.get(key);
            String currentValue = preferences.get(key);

            if (currentValue == null) {
                preferences.set(key, value);
                migrated.add(key);
            } else {
                existing.add(key);
            }
        }

        JSObject ret = new JSObject();
        ret.put("migrated", new JSArray(migrated));
        ret.put("existing", new JSArray(existing));
        call.resolve(ret);
    }

    @PluginMethod
    public void preferenceRemoveOld(PluginCall call) {
        call.resolve();
    }


    private String getDataString(HashMap<String, String> params) throws UnsupportedEncodingException {
        StringBuilder result = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (first) first = false;
            else result.append("&");
            result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
            result.append("=");
            result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
        }
        return result.toString();
    }
}
