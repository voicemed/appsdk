package com.voicemed.appsdk.httputils;

public class APIResponseObject {
    public int responseCode;
    public String response;

    APIResponseObject(int responseCode,String response)
    {
        this.responseCode = responseCode;
        this.response = response;
    }
}
