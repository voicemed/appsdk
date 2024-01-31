package com.voicemed.appsdk;

public class PreferencesConfiguration implements Cloneable {

  static final PreferencesConfiguration DEFAULTS;

  static {
    DEFAULTS = new PreferencesConfiguration();
    DEFAULTS.group = "CapacitorStorage";
  }

  String group;

  @Override
  public PreferencesConfiguration clone() throws CloneNotSupportedException {
    return (PreferencesConfiguration) super.clone();
  }
}
