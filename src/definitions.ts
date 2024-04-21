/// <reference types="@capacitor/cli" />
declare module '@capacitor/cli' {
    export interface PluginsConfig {
        /**
         * These config values are available:
         */
        VoicemedPlugin?: {
            /**
             * Define the AppKey provided by VoiceMed
             *
             * @since 0.0.1
             * @example "adsfwe23qfq42wawq3"
             */
            appKey?: string;

            /**
             * Define environment
             *
             * @since 0.0.1
             * @default production
             * @example "staging"
             */
            environment?: 'production' | 'staging';
        };
    }
}

export interface VoicemedAuthenticateUser {
    /**
     * Define the unique id that identifies user
     */
    externalID?: string;
    /**
     * If available, send user email
     */
    email?: string;
    /**
     * Key value pairs, suggested for best results: age, height, weight, sex
     */
    usermeta?: {
        /**
         * age in numbers
         */
        age?: number;

        /**
         * height in centimeters
         */
        height?: number;

        /**
         * weight in grams
         */
        weight?: number;

        /**
         * Sex: M for Male, F for Female, O for Other, U for unspecified
         */
        sex?: 'M' | 'F' | 'O' | 'U';
    };
}

export interface VoiceMedChallenges {
    "_id": string,
    "name": string,
    "exercises": VoiceMedExercise[]
}

export interface VoiceMedExercise {
    tags: string[];
    "createdAt": string;
    "updatedAt": string;
    "order": bigint;
    "title": string;
    "about": string;
    "intro": string;
    "questionnaire": object[];
    "quiz": object[];
    "postDescription": string;
    "medicalRisks": string;
    "internalIdCode": string;
    "tutorialVideo"?: string;
    "tutorialVideoThumbnail"?: string;
    "type": string;
    "subtype": string;
    "id": string;
    "thumb": string;
    "duration": bigint;
    "durationMs": bigint;
    "exercises": object[];
    "completed": boolean;
    "steps": object[];
    "cycles": bigint;
    "audio": string;
    "video": string;
    "videoThumbnail": string;
    "__v": bigint;
}

export interface VoiceMedRequestExercise {
    "token": string;
    "id": string;
    "program_id": string;
    "program_index": bigint;
}

export interface VoiceMedRequestChallenge {
    "token": string;
    "program_id": string;
}

export interface VoiceMedRequest {
    "token": string;
    "full": boolean
}

export interface VoiceMedFinishExercise {
    "reason": string;
    "result": {
        "flowScore"?: any
        "timeScore"?: any
        "cyclesScore"?: any
    }
}

export interface VoiceMedFinishChallenge {
    "reason": string;
}


export interface VoicemedPlugin {
    /* Dummy method */
    echo(options: {
        value: string
    }): Promise<{
        value: string
    }>;
    getEnvironment(options: {
        value: string
    }): Promise<{
        environment: string
    }>;
    setEnvironment(options: {
        environment: string
    }): Promise<{
        value: string
    }>;

    authenticateUser(options: VoicemedAuthenticateUser): Promise<{ token: string }>;

    authenticateByToken(options: VoiceMedRequest): Promise<{ token: string }>;

    listExercises(options: VoiceMedRequest): Promise<{ challenges: VoiceMedChallenges[] }>;

    startExercise(options: VoiceMedRequestExercise): Promise<{ value: string }>;

    startChallenge(options: VoiceMedRequestChallenge): Promise<{ value: string }>;

    finishExercise(options: VoiceMedFinishExercise): Promise<{ value: string }>;

    finishChallenge(options: VoiceMedFinishChallenge): Promise<{ value: string }>;

    closeExercise(): Promise<{ value: string }>;

    closeChallenge(): Promise<{ value: string }>;

    checkCameraPerm(): Promise<{
        value: string
    }>;

    maxVolume(): Promise<{
        value: string
    }>;

    revertVolume(): Promise<{
        value: string
    }>;

    openPermissionPanel(): Promise<{
        value: string
    }>;

    checkMicPerm(): Promise<{
        value: string
    }>;

    checkWholePermissions(): Promise<{
        value: string
    }>;

    requestWholePermissions(): Promise<{
        value: string
    }>;

    canDeviceVoiceRecord(): Promise<{
        value: string
    }>;

    requestAudioRecordingPermission(): Promise<{
        value: string
    }>;

    hasAudioRecordingPermission(): Promise<{
        value: string
    }>;

    startRecording(options: {
        useAGC: boolean
    }): Promise<{
        value: string
    }>;

    stopRecording(): Promise<{
        value: string
    }>;

    pauseRecording(): Promise<{
        value: string
    }>;

    resumeRecording(): Promise<{
        value: string
    }>;

    getCurrentStatus(): Promise<{
        value: string
    }>;


    preferenceConfigure(options: {
        group: string
    }): Promise<{
        value: string
    }>;

    preferenceGet(options: {
        key: string
    }): Promise<{
        value: string
    }>;

    preferenceRemove(options: {
        key: string
    }): Promise<{
        value: string
    }>;

    preferenceSet(options: {
        key: string,
        value: string
    }): Promise<{
        value: string
    }>;

    preferenceKeys(): Promise<{
        value: string
    }>;

    preferenceClear(): Promise<{
        value: string
    }>;

    preferenceMigrate(): Promise<{
        value: string
    }>;

}
