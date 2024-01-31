package com.voicemed.appsdk.recorder;

import java.util.ArrayList;

public class MeterTable {
  private static float kMinDB = -60f;
  private static Integer tableSize = 300;
  private float scaleFactor;
  private ArrayList<Float> meterTable = new ArrayList<>();

  public MeterTable() {
    float dbResolutions = kMinDB / (tableSize - 1);
    scaleFactor = 1.0f / dbResolutions;
    float root = 2.0f;
    float rroot = 1.0f / root;

    float minAmp = dbToAmp(kMinDB);
    float ampRange = 1.0f - minAmp;
    float invAmpRange = 1.0f / ampRange;

    for (int index = 0; index < tableSize; index++) {
      float decibels = index * dbResolutions;
      float amp = dbToAmp(decibels);
      float adjAmp = (amp - minAmp) * invAmpRange;
      meterTable.add((float) Math.pow(adjAmp, rroot));
    }

  }

  private float dbToAmp(float dbValue) {
    return (float) Math.pow(10.0f, 0.05f * dbValue);
  }

  public float valueForPower(float power) {
    if (power < kMinDB) {
      return 0.0f;
    } else if (power >= 0.0) {
      return 1.0f;
    } else {
      int index = (Math.round(power)) * (Math.round(scaleFactor));
      return meterTable.get(index);
    }
  }

}
