package com.voicemed.appsdk.httputils;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;
import android.util.Log;
import android.util.Pair;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class APIAccessTask extends AsyncTask<String, Void, APIResponseObject> {
    URL requestUrl;
    Context context;
    HttpURLConnection urlConnection;
    List<Pair<String, String>> postData, headerData;
    String method;
    int responseCode = HttpURLConnection.HTTP_OK;

    public interface OnCompleteListener {
        void onComplete(APIResponseObject result);
    }

    public OnCompleteListener delegate = null;

    public APIAccessTask(Context context, String requestUrl, String method, OnCompleteListener delegate) {
        this.context = context;
        this.delegate = delegate;
        this.method = method;
        try {
            this.requestUrl = new URL(requestUrl);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public APIAccessTask(Context context, String requestUrl, String method, List<Pair<String, String>> postData, OnCompleteListener delegate) {
        this(context, requestUrl, method, delegate);
        this.postData = postData;
    }

    public APIAccessTask(Context context, String requestUrl, String method, List<Pair<String, String>> postData,
                         List<Pair<String, String>> headerData, OnCompleteListener delegate) {
        this(context, requestUrl, method, postData, delegate);
        this.headerData = headerData;
    }


    @Override
    protected APIResponseObject doInBackground(String... params) {
        Log.d("debug", "url = " + requestUrl);
        try {
            urlConnection = (HttpURLConnection) requestUrl.openConnection();

            if (headerData != null) {
                for (Pair pair : headerData) {
                    urlConnection.setRequestProperty(pair.first.toString(), pair.second.toString());
                }
            }

            urlConnection.setDoInput(true);
            urlConnection.setChunkedStreamingMode(0);
            urlConnection.setRequestMethod(method);
            urlConnection.connect();

            StringBuilder sb = new StringBuilder();

            if (!(method.equals("GET"))) {
                OutputStream out = new BufferedOutputStream(urlConnection.getOutputStream());
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
                writer.write(getPostDataString(postData));
                writer.flush();
                writer.close();
                out.close();
            }

            urlConnection.connect();
            responseCode = urlConnection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                InputStream in = new BufferedInputStream(urlConnection.getInputStream());
                BufferedReader reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
                String line;

                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            }

            return new APIResponseObject(responseCode, sb.toString());
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    protected void onPostExecute(APIResponseObject result) {
        delegate.onComplete(result);
        super.onPostExecute(result);
    }

    private String getPostDataString(List<Pair<String, String>> params) throws UnsupportedEncodingException {
        StringBuilder result = new StringBuilder();
        boolean first = true;
        for (Pair<String, String> pair : params) {
            if (first)
                first = false;
            else
                result.append("&");

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                result.append(URLEncoder.encode(pair.first, StandardCharsets.UTF_8));
            }
            result.append("=");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                result.append(URLEncoder.encode(pair.second, StandardCharsets.UTF_8));
            }
        }
        return result.toString();
    }

}
