package com.voicemed.appsdk.recorder;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.AudioDeviceInfo;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioRouting;
import android.media.MediaRecorder;
import android.media.MicrophoneDirection;
import android.media.MicrophoneInfo;
import android.media.audiofx.AutomaticGainControl;
import android.os.Build;
import android.os.Environment;
import android.os.SystemClock;
import android.provider.MediaStore;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

public class CustomMediaRecorder {

  public interface meterListener {
    public void onUpdateMeter(double peakPower, double averagePower);
  }

  public interface activeMicListener {
    public void onUpdateMic(MicrophoneInfo mic, AudioDeviceInfo current);
  }

  private meterListener listener;
  private activeMicListener micListener;
  private int previousVolume;
  private int previousVcalVolume;

  private final Context context;
  private MediaRecorder mediaRecorder;
  private AudioRecord audioRecord;
  private File outputFile;
  private CurrentRecordingStatus currentRecordingStatus = CurrentRecordingStatus.NONE;
  private static final int SAMPLING_RATE_IN_HZ = 44100;
  private static final int CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO;
  private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT;
  private static final int BUFFER_SIZE_FACTOR = 2;
  private static final int BUFFER_SIZE = AudioRecord.getMinBufferSize(SAMPLING_RATE_IN_HZ,
    CHANNEL_CONFIG, AUDIO_FORMAT) * BUFFER_SIZE_FACTOR;

  private final AtomicBoolean recordingInProgress = new AtomicBoolean(false);
  private final AtomicBoolean recordingInPause = new AtomicBoolean(false);
  private AudioRecord recorder = null;
  private Thread recordingThread = null;
  private boolean useAgc = false;
  private AutomaticGainControl agcController = null;
  private List<MicrophoneInfo> availableMics = null;
  private AudioDeviceInfo[] availableDevices = null;

  private float mPeakPower = -120;
  private float mAveragePower = -120;
  private MeterTable meterTableAverage = new MeterTable();
  private MeterTable meterTablePeak = new MeterTable();


  public CustomMediaRecorder(Context context, boolean agc) throws IOException {
    this.context = context;
    this.useAgc = agc;
    //generateMediaRecorder();
    generateAudioRecorder();
    this.listener = null;
  }

  public void setOnUpdateMeterListener(meterListener listener) {
    this.listener = listener;
  }

  public void setOnGotDeviceInfoListener(activeMicListener listener) {
    this.micListener = listener;
  }

  @SuppressLint("MissingPermission")
  private void generateAudioRecorder() throws IOException {
    //Enable source without any process :RAW https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#UNPROCESSED
    //Unprocessed disabled too low volume, needs an hard amplifier by 20db at least
    audioRecord = new AudioRecord(
      (this.useAgc == true ? MediaRecorder.AudioSource.MIC : MediaRecorder.AudioSource.UNPROCESSED),
      SAMPLING_RATE_IN_HZ,
      CHANNEL_CONFIG,
      AUDIO_FORMAT,
      BUFFER_SIZE
    );
    if (this.useAgc == true && AutomaticGainControl.isAvailable()) {
      this.agcController = AutomaticGainControl.create(audioRecord.getAudioSessionId());
    }

    AudioManager am = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      availableDevices = am.getDevices(AudioManager.GET_DEVICES_INPUTS);
    } else {
      availableDevices = null;
    }

    setRecorderOutputFile(".wav");
  }

  private void generateMediaRecorder() throws IOException {
    mediaRecorder = new MediaRecorder();

    mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
    mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.AAC_ADTS);
    mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
    setRecorderOutputFile(".aac");
    mediaRecorder.prepare();
  }

  private void setRecorderOutputFile(String suffix) throws IOException {
    File outputDir = context.getCacheDir();
    outputFile = File.createTempFile("voice_record_temp", suffix, outputDir);
    outputFile.deleteOnExit();
    if (mediaRecorder != null) {
      mediaRecorder.setOutputFile(outputFile.getAbsolutePath());
    }
  }


  private void updateCurrentMics() {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        availableMics = audioRecord.getActiveMicrophones();
      }
      if (availableMics != null && availableMics.size() > 0) {
        if (this.micListener != null) {
          AudioDeviceInfo current = null;
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            String adiAddress = availableMics.get(0).getAddress();
            if (availableDevices != null) {
              for (AudioDeviceInfo device : availableDevices) {
                if (device.getAddress().equals(adiAddress)) {
                  current = device;
                  break;
                }
              }
            }
          }
          this.micListener.onUpdateMic(availableMics.get(0), current);
        }
      }
    } catch (Exception ex) {
      availableMics = null;
    }
  }

  public void startRecording() {
    AudioManager am = (AudioManager) this.context.getSystemService(Context.AUDIO_SERVICE);

    previousVolume = am.getStreamVolume(AudioManager.STREAM_MUSIC);
    previousVcalVolume = am.getStreamVolume(AudioManager.STREAM_VOICE_CALL);
    am.setStreamVolume(AudioManager.STREAM_MUSIC, am.getStreamMaxVolume(AudioManager.STREAM_MUSIC), 0);
    am.setStreamVolume(AudioManager.STREAM_VOICE_CALL, am.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL), 0);
    mPeakPower = -120;
    mAveragePower = -120;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      audioRecord.setPreferredMicrophoneDirection(MicrophoneDirection.MIC_DIRECTION_TOWARDS_USER);
      audioRecord.setPreferredMicrophoneFieldDimension(1);
    }

    try {
      deleteOutputFile();
      setRecorderOutputFile(".wav");
    } catch (IOException e) {
      Log.e("VOICEMED", "Cannot prepare file");
    }
    if (this.useAgc == true && this.agcController != null) {
      this.agcController.setEnabled(this.useAgc);

    }
    updateCurrentMics();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      audioRecord.addOnRoutingChangedListener(new AudioRouting.OnRoutingChangedListener() {
        @Override
        public void onRoutingChanged(AudioRouting audioRouting) {
          if(audioRouting != null && audioRouting.getRoutedDevice() != null) {
            Log.d("VOICEMED", "Change routing" + audioRouting.getRoutedDevice().getProductName());
          }
          updateCurrentMics();
        }
      }, null);
    }
    audioRecord.startRecording();

    recordingInProgress.set(true);
    recordingInPause.set(false);
    recordingThread = new Thread(new RecordingRunnable(), "Recording Thread");
    recordingThread.start();
    currentRecordingStatus = CurrentRecordingStatus.RECORDING;
  }

  public void stopRecording() {
    AudioManager am = (AudioManager) this.context.getSystemService(Context.AUDIO_SERVICE);
    am.setStreamVolume(AudioManager.STREAM_MUSIC, previousVolume, 0);
    am.setStreamVolume(AudioManager.STREAM_VOICE_CALL, previousVcalVolume, 0);
    if (null == audioRecord) {
      return;
    }
    recordingInProgress.set(false);
    audioRecord.stop();
    audioRecord.release();
    audioRecord = null;
    recordingThread = null;
    currentRecordingStatus = CurrentRecordingStatus.NONE;
    try {
      updateWavHeader(this.outputFile);
      Log.d("VOICEMED", "Finished updated wav Headers");
    } catch (IOException ex) {
      Log.e("VOICEMED", "Impossibile aggiornare il wavFile");
    }
  }

  public void _startRecording() {
    mediaRecorder.start();
    currentRecordingStatus = CurrentRecordingStatus.RECORDING;
  }

  public void _stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.release();
    currentRecordingStatus = CurrentRecordingStatus.NONE;
  }

  public File getOutputFile() {
    return outputFile;
  }

  public boolean pauseRecording() {
    currentRecordingStatus = CurrentRecordingStatus.PAUSED;
    recordingInPause.set(true);
    return true;
  }

  public boolean resumeRecording() {
    recordingInPause.set(false);
    currentRecordingStatus = CurrentRecordingStatus.RECORDING;
    return true;
  }

  public boolean _pauseRecording() throws NotSupportedOsVersion {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      throw new NotSupportedOsVersion();
    }

    if (currentRecordingStatus == CurrentRecordingStatus.RECORDING) {
      mediaRecorder.pause();
      currentRecordingStatus = CurrentRecordingStatus.PAUSED;
      return true;
    } else {
      return false;
    }
  }

  public boolean _resumeRecording() throws NotSupportedOsVersion {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
      throw new NotSupportedOsVersion();
    }

    if (currentRecordingStatus == CurrentRecordingStatus.PAUSED) {
      mediaRecorder.resume();
      currentRecordingStatus = CurrentRecordingStatus.RECORDING;
      return true;
    } else {
      return false;
    }
  }

  public CurrentRecordingStatus getCurrentStatus() {
    return currentRecordingStatus;
  }

  public boolean deleteOutputFile() {
    return outputFile.delete();
  }

  public static boolean canPhoneCreateMediaRecorder(Context context) {
    return true;
  }

  /*
  private static boolean canPhoneCreateMediaRecorderWhileHavingPermission(Context context) {
    CustomMediaRecorder tempMediaRecorder = null;
    try {
      tempMediaRecorder = new CustomMediaRecorder(context);
      tempMediaRecorder.startRecording();
      tempMediaRecorder.stopRecording();
      return true;
    } catch (Exception exp) {
      return exp.getMessage().startsWith("stop failed");
    } finally {
      if (tempMediaRecorder != null)
        tempMediaRecorder.deleteOutputFile();
    }
  }

  */

  private short[] byte2short(byte[] bData) {
    short[] out = new short[bData.length / 2];
    ByteBuffer.wrap(bData).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(out);
    return out;
  }

  private void updatePowers(byte[] bdata) {
    short[] data = byte2short(bdata);
    float iOSFactor = 0.25f;
    short sampleVal = data[data.length - 1];
    if (sampleVal == 0) {
      mAveragePower = -120; // to match iOS silent case
    } else {
      mAveragePower = 20.0f * (float) Math.log(Math.abs(sampleVal) / 32768.0f) * iOSFactor;
    }
    mPeakPower = mAveragePower;


    /* usa la tabella di conversione per tornare i valori */
    updateAudioLevels(mPeakPower, mAveragePower);
    //listener.onUpdateMeter(mPeakPower, mAveragePower);
  }

  private void updateAudioLevels(float peak, float average) {
    if (average == -120 || peak == -120) {
      listener.onUpdateMeter(0, 0);
      return;
    }
    listener.onUpdateMeter(meterTablePeak.valueForPower(peak), meterTableAverage.valueForPower(average));
  }

  private void _updatePowers(byte[] bdata) {
    //
    short[] data = byte2short(bdata);
    ArrayList levelsSum = new ArrayList();
    //short sampleVal = data[data.length - 1];
    long samples = 70;
    int blockSize = (int) Math.floor(data.length / samples);
    double iOSFactor = 0.25;
    for (int i = 0; i < samples; i++) {
      int blockStart = blockSize * i;
      double sum = 0;
      for (int j = 0; j < blockSize; j++) {
        //sum = sum + (20 * Math.log(Math.abs(data[blockStart+j]) / 32768.0)  * iOSFactor);
        sum = sum + (Math.abs(data[blockStart + j]) * iOSFactor);
      }
      levelsSum.add(sum / blockSize);
    }
    if (this.listener != null) {
      //listener.onUpdateMeter(levelsSum);
    }
  }

  private class RecordingRunnable implements Runnable {

    long startTime = 0;
    long endTime = 0;

    @Override
    public void run() {
      //final File file = new File(Environment.getExternalStorageDirectory(), "recording.pcm");
      final File file = outputFile;
      startTime = SystemClock.elapsedRealtime();
      try (FileOutputStream outStream = new FileOutputStream(file)) {
        //Log.d("VOICEMED", "Start recordingRunnable process");
        byte[] buffer = new byte[BUFFER_SIZE];
        int read;
        long total = 0;
        int gain = 2;

        writeWavHeader(outStream, CHANNEL_CONFIG, SAMPLING_RATE_IN_HZ, AUDIO_FORMAT); //Avvia il file
        while (recordingInProgress.get()) {
          //Log.d("VOICEMED", "During(Record) recordingRunnable process");
          if (recordingInPause.get() == false) {
            read = audioRecord.read(buffer, 0, buffer.length);
            if (total + read > 4294967295L) {
              // Write as many bytes as we can before hitting the max size
              for (int i = 0; i < read && total <= 4294967295L; i++, total++) {
                //if (useAgc == true) {
                //  buffer[i] = (short) Math.min((int) (buffer[i] * gain), (int) Short.MAX_VALUE);
                //}
                outStream.write(buffer[i]);
              }
            } else {
              // Write out the entire read buffer
              if (useAgc == true) {
                //for (int i = 0; i < read; ++i) {
                //  buffer[i] = (short) Math.min((int) (buffer[i] * gain), (int) Short.MAX_VALUE);
                //}
              }
              outStream.write(buffer, 0, read);
              total += read;
            }
            if (read < 0) {
              throw new RuntimeException("Reading of audio buffer failed: " +
                getBufferReadFailureReason(read));
            }
            updatePowers(buffer);
          }
        }
        outStream.close();
        Log.d("VOICEMED", "Finish? recordingRunnable process");
      } catch (IOException e) {
        throw new RuntimeException("Writing of recorded audio failed", e);
      }
      //
    }

    private String getBufferReadFailureReason(int errorCode) {
      switch (errorCode) {
        case AudioRecord.ERROR_INVALID_OPERATION:
          return "ERROR_INVALID_OPERATION";
        case AudioRecord.ERROR_BAD_VALUE:
          return "ERROR_BAD_VALUE";
        case AudioRecord.ERROR_DEAD_OBJECT:
          return "ERROR_DEAD_OBJECT";
        case AudioRecord.ERROR:
          return "ERROR";
        default:
          return "Unknown (" + errorCode + ")";
      }
    }
  }

  private static void writeWavHeader(OutputStream out, int channelMask, int sampleRate, int encoding) throws IOException {
    short channels;
    switch (channelMask) {
      case AudioFormat.CHANNEL_IN_MONO:
        channels = 1;
        break;
      case AudioFormat.CHANNEL_IN_STEREO:
        channels = 2;
        break;
      default:
        throw new IllegalArgumentException("Unacceptable channel mask");
    }

    short bitDepth;
    switch (encoding) {
      case AudioFormat.ENCODING_PCM_8BIT:
        bitDepth = 8;
        break;
      case AudioFormat.ENCODING_PCM_16BIT:
        bitDepth = 16;
        break;
      case AudioFormat.ENCODING_PCM_FLOAT:
        bitDepth = 32;
        break;
      default:
        throw new IllegalArgumentException("Unacceptable encoding");
    }

    writeWavHeader(out, channels, sampleRate, bitDepth);
  }

  /**
   * Writes the proper 44-byte RIFF/WAVE header to/for the given stream
   * Two size fields are left empty/null since we do not yet know the final stream size
   *
   * @param out        The stream to write the header to
   * @param channels   The number of channels
   * @param sampleRate The sample rate in hertz
   * @param bitDepth   The bit depth
   * @throws IOException
   */
  private static void writeWavHeader(OutputStream out, short channels, int sampleRate, short bitDepth) throws IOException {
    // Convert the multi-byte integers to raw bytes in little endian format as required by the spec
    byte[] littleBytes = ByteBuffer
      .allocate(14)
      .order(ByteOrder.LITTLE_ENDIAN)
      .putShort(channels)
      .putInt(sampleRate)
      .putInt(sampleRate * channels * (bitDepth / 8))
      .putShort((short) (channels * (bitDepth / 8)))
      .putShort(bitDepth)
      .array();

    // Not necessarily the best, but it's very easy to visualize this way
    out.write(new byte[]{
      // RIFF header
      'R', 'I', 'F', 'F', // ChunkID
      0, 0, 0, 0, // ChunkSize (must be updated later)
      'W', 'A', 'V', 'E', // Format
      // fmt subchunk
      'f', 'm', 't', ' ', // Subchunk1ID
      16, 0, 0, 0, // Subchunk1Size
      1, 0, // AudioFormat
      littleBytes[0], littleBytes[1], // NumChannels
      littleBytes[2], littleBytes[3], littleBytes[4], littleBytes[5], // SampleRate
      littleBytes[6], littleBytes[7], littleBytes[8], littleBytes[9], // ByteRate
      littleBytes[10], littleBytes[11], // BlockAlign
      littleBytes[12], littleBytes[13], // BitsPerSample
      // data subchunk
      'd', 'a', 't', 'a', // Subchunk2ID
      0, 0, 0, 0, // Subchunk2Size (must be updated later)
    });
  }

  /**
   * Updates the given wav file's header to include the final chunk sizes
   *
   * @param wav The wav file to update
   * @throws IOException
   */
  private static void updateWavHeader(File wav) throws IOException {
    byte[] sizes = ByteBuffer
      .allocate(8)
      .order(ByteOrder.LITTLE_ENDIAN)
      // There are probably a bunch of different/better ways to calculate
      // these two given your circumstances. Cast should be safe since if the WAV is
      // > 4 GB we've already made a terrible mistake.
      .putInt((int) (wav.length() - 8)) // ChunkSize
      .putInt((int) (wav.length() - 44)) // Subchunk2Size
      .array();

    RandomAccessFile accessWave = null;
    //noinspection CaughtExceptionImmediatelyRethrown
    try {
      accessWave = new RandomAccessFile(wav, "rw");
      // ChunkSize
      accessWave.seek(4);
      accessWave.write(sizes, 0, 4);

      // Subchunk2Size
      accessWave.seek(40);
      accessWave.write(sizes, 4, 4);
    } catch (IOException ex) {
      // Rethrow but we still close accessWave in our finally
      throw ex;
    } finally {
      if (accessWave != null) {
        try {
          accessWave.close();
        } catch (IOException ex) {
          //
        }
      }
    }
  }
}
