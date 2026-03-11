'use strict';

let isPresenter = false;

// ####################################################
// SHOW HIDE DESIRED BUTTONS BY RULES
// ####################################################

const isRulesActive = true;

/**
 * WARNING!
 * This will be replaced by the ui.buttons specified in the server configuration file located at app/src/config.js.
 * Ensure that any changes made here are also reflected in the configuration file to maintain synchronization.
 */
let BUTTONS = {
    popup: {
        shareRoomPopup: true,
        shareRoomQrOnHover: true,
    },
    main: {
        shareButton: true, // for quest, presenter default true
        hideMeButton: true,
        fullScreenButton: true,
        startAudioButton: true,
        startVideoButton: true,
        startScreenButton: true,
        swapCameraButton: true,
        chatButton: true,
        participantsButton: true,
        pollButton: true,
        editorButton: true,
        raiseHandButton: true,
        transcriptionButton: true,
        whiteboardButton: true,
        documentPiPButton: true,
        snapshotRoomButton: true,
        emojiRoomButton: true,
        settingsButton: true,
        aboutButton: true, // Please keep me always visible, thank you!
        endCallForEveryoneButton: true,
        exitButton: true,
        extraButton: true,
    },
    settings: {
        activeRooms: true,
        videoSharing: true,
        fileSharing: true,
        lockRoomButton: true, // presenter
        unlockRoomButton: true, // presenter
        broadcastingButton: true, // presenter
        lobbyButton: true, // presenter
        sendEmailInvitation: true, // presenter
        micOptionsButton: true,
        tabRTMPStreamingBtn: true, // presenter
        tabNotificationsBtn: true, // presenter
        tabModerator: true, // presenter
        tabRecording: true,
        host_only_recording: true, // presenter
        pushToTalk: true,
        keyboardShortcuts: true,
        virtualBackground: true,
        customNoiseSuppression: true, // use RNNoise else WebRTC built-in
    },
    producerVideo: {
        videoPictureInPicture: true,
        videoMirrorButton: true,
        fullScreenButton: true,
        snapShotButton: true,
        focusVideoButton: true,
        muteAudioButton: true,
        videoPrivacyButton: true,
        audioVolumeInput: true,
        drawingButton: true,
    },
    consumerVideo: {
        videoPictureInPicture: true,
        videoMirrorButton: true,
        fullScreenButton: true,
        snapShotButton: true,
        focusVideoButton: true,
        sendMessageButton: true,
        sendFileButton: true,
        sendVideoButton: true,
        muteVideoButton: true,
        muteAudioButton: true,
        audioVolumeInput: true,
        geolocationButton: true, // Presenter
        banButton: true, // presenter
        ejectButton: true, // presenter
        drawingButton: true, // presenter
    },
    videoOff: {
        sendMessageButton: true,
        sendFileButton: true,
        sendVideoButton: true,
        muteAudioButton: true,
        audioVolumeInput: true,
        geolocationButton: true, // Presenter
        banButton: true, // presenter
        ejectButton: true, // presenter
    },
    chat: {
        chatPinButton: true,
        chatMaxButton: true,
        chatSaveButton: true,
        chatEmojiButton: true,
        chatMarkdownButton: true,
        chatSpeechStartButton: true,
        chatGPT: true,
        deepSeek: false,
    },
    poll: {
        pollPinButton: true,
        pollMaxButton: true,
        pollSaveButton: true,
    },
    participantsList: {
        saveInfoButton: true, // presenter
        sendFileAllButton: true, // presenter
        ejectAllButton: true, // presenter
        sendFileButton: true, // presenter & guests
        geoLocationButton: true, // presenter
        banButton: true, // presenter
        ejectButton: true, // presenter
        grantPresenterButton: true, // presenter — share/revoke admin access
    },
    whiteboard: {
        whiteboardLockButton: true, // presenter
    },
    //...
};

// Keep original config values so runtime role changes (guest <-> presenter)
// do not permanently overwrite presenter-only visibility flags.
const BUTTONS_DEFAULTS = {
    settings: {
        lockRoomButton: BUTTONS.settings.lockRoomButton,
        unlockRoomButton: BUTTONS.settings.unlockRoomButton,
    },
};

/**
 * @param {boolean} isPresenter     - Whether the local peer is a presenter/admin.
 * @param {boolean} skipRoomActions - When true (runtime grant/revoke), skip the socket
 *                                    emissions for broadcasting/lobby/recording/moderator.
 *                                    Those should only fire on initial room join, not every
 *                                    time presenter status changes mid-session.
 */
function handleRules(isPresenter, skipRoomActions = false) {
    console.log('07.1 ----> IsPresenter: ' + isPresenter + ' | skipRoomActions: ' + skipRoomActions);
    if (!isRulesActive) return;
    if (!isPresenter) {
        // ##################################
        // GUEST
        // ##################################
        BUTTONS.main.shareButton = false;
        BUTTONS.settings.activeRooms = false;
        BUTTONS.settings.videoSharing = false;
        BUTTONS.participantsList.saveInfoButton = false;
        BUTTONS.settings.lockRoomButton = false;
        BUTTONS.settings.unlockRoomButton = false;
        BUTTONS.settings.broadcastingButton = false;
        BUTTONS.settings.lobbyButton = false;
        BUTTONS.settings.sendEmailInvitation = false;
        BUTTONS.settings.tabRTMPStreamingBtn = false;
        BUTTONS.settings.tabModerator = false;
        BUTTONS.settings.tabNotificationsBtn = false;
        BUTTONS.videoOff.muteAudioButton = false;
        BUTTONS.videoOff.geolocationButton = false;
        BUTTONS.videoOff.banButton = false;
        BUTTONS.videoOff.ejectButton = false;
        BUTTONS.consumerVideo.geolocationButton = false;
        BUTTONS.consumerVideo.banButton = false;
        BUTTONS.consumerVideo.ejectButton = false;
        // BUTTONS.consumerVideo.drawingButton = false;
        // BUTTONS.producerVideo.drawingButton = false;
        BUTTONS.main.editorButton = false;
        BUTTONS.main.whiteboardButton = false;
        BUTTONS.whiteboard.whiteboardLockButton = false;
        BUTTONS.participantsList.grantPresenterButton = false; // Guests cannot share admin access
        BUTTONS.main.endCallForEveryoneButton = false;

        //...
    } else {
        // ##################################
        // PRESENTER
        // ##################################
        BUTTONS.main.shareButton = true;
        BUTTONS.settings.activeRooms = true;
        BUTTONS.settings.videoSharing = true;
        BUTTONS.settings.tabRTMPStreamingBtn = true;
        BUTTONS.settings.lockRoomButton = BUTTONS_DEFAULTS.settings.lockRoomButton && !isRoomLocked;
        BUTTONS.settings.unlockRoomButton = BUTTONS_DEFAULTS.settings.unlockRoomButton && isRoomLocked;
        BUTTONS.settings.sendEmailInvitation = true;
        BUTTONS.settings.tabModerator = true;
        BUTTONS.settings.broadcastingButton = true;
        BUTTONS.settings.lobbyButton = true;
        BUTTONS.settings.tabNotificationsBtn = true;
        BUTTONS.participantsList.saveInfoButton = true;
        BUTTONS.videoOff.muteAudioButton = true;
        BUTTONS.videoOff.geolocationButton = true;
        BUTTONS.videoOff.banButton = true;
        BUTTONS.videoOff.ejectButton = true;
        BUTTONS.consumerVideo.geolocationButton = true;
        BUTTONS.consumerVideo.banButton = true;
        BUTTONS.consumerVideo.ejectButton = true;
        BUTTONS.main.editorButton = true;
        BUTTONS.main.whiteboardButton = true;
        BUTTONS.whiteboard.whiteboardLockButton = true;
        BUTTONS.participantsList.grantPresenterButton = true;
        BUTTONS.main.endCallForEveryoneButton = true;

        if (rc.isEditorLocked) {
            show(editorLockBtn);
            hide(editorUnlockBtn);
            setColor(editorLockBtn, 'red');
        } else {
            show(editorUnlockBtn);
            hide(editorLockBtn);
            setColor(editorUnlockBtn, 'white');
        }
        show(transcriptionAllLi);
        //...

        // ##################################
        // Auto detected rules for presenter
        // Only run on initial join, NOT on runtime grant (skipRoomActions = true)
        // ##################################
        if (!skipRoomActions) {
            // Room broadcasting
            isBroadcastingEnabled = localStorageSettings.broadcasting;
            switchBroadcasting.checked = isBroadcastingEnabled;
            rc.roomAction('broadcasting', true, false);
            if (isBroadcastingEnabled) rc.toggleRoomBroadcasting();
            // Room lobby
            isLobbyEnabled = localStorageSettings.lobby;
            switchLobby.checked = isLobbyEnabled;
            rc.roomAction(isLobbyEnabled ? 'lobbyOn' : 'lobbyOff', true, false);
            // Room host-only-recording
            hostOnlyRecording = localStorageSettings.host_only_recording;
            switchHostOnlyRecording.checked = hostOnlyRecording;
            rc.roomAction(hostOnlyRecording ? 'hostOnlyRecordingOn' : 'hostOnlyRecordingOff', true, false);
            // Room moderator
            switchEveryonePrivacy.checked = localStorageSettings.moderator_video_start_privacy;
            switchEveryoneMute.checked = localStorageSettings.moderator_audio_start_muted;
            switchEveryoneHidden.checked = localStorageSettings.moderator_video_start_hidden;
            switchEveryoneCantUnmute.checked = localStorageSettings.moderator_audio_cant_unmute;
            switchEveryoneCantUnhide.checked = localStorageSettings.moderator_video_cant_unhide;
            switchEveryoneCantShareScreen.checked = localStorageSettings.moderator_screen_cant_share;
            switchEveryoneCantChatPrivately.checked = localStorageSettings.moderator_chat_cant_privately;
            switchEveryoneCantChatChatGPT.checked = localStorageSettings.moderator_chat_cant_chatgpt;
            switchEveryoneCantChatDeepSeek.checked = localStorageSettings.moderator_chat_cant_deep_seek;
            switchEveryoneCantMediaSharing.checked = localStorageSettings.moderator_media_cant_sharing;
            switchDisconnectAllOnLeave.checked = localStorageSettings.moderator_disconnect_all_on_leave;

            // Update moderator settings...
            const moderatorData = {
                video_start_privacy: switchEveryonePrivacy.checked,
                audio_start_muted: switchEveryoneMute.checked,
                video_start_hidden: switchEveryoneHidden.checked,
                audio_cant_unmute: switchEveryoneCantUnmute.checked,
                video_cant_unhide: switchEveryoneCantUnhide.checked,
                screen_cant_share: switchEveryoneCantShareScreen.checked,
                chat_cant_privately: switchEveryoneCantChatPrivately.checked,
                chat_cant_chatgpt: switchEveryoneCantChatChatGPT.checked,
                chat_cant_deep_seek: switchEveryoneCantChatDeepSeek.checked,
                media_cant_sharing: switchEveryoneCantMediaSharing.checked,
                disconnect_all_on_leave: switchDisconnectAllOnLeave.checked,
            };
            console.log('Rules moderator data ---->', moderatorData);
            rc.updateRoomModeratorALL(moderatorData);
        } // end !skipRoomActions
    }
    // main. settings...
    BUTTONS.main.shareButton ? show(shareButton) : hide(shareButton);
    isPresenter && BUTTONS.main.shareButton ? show(chatShareRoomBtn) : hide(chatShareRoomBtn);
    BUTTONS.main.editorButton ? show(editorButton) : hide(editorButton);
    BUTTONS.main.whiteboardButton ? show(whiteboardButton) : hide(whiteboardButton);
    BUTTONS.main.endCallForEveryoneButton ? show(endCallForEveryoneButton) : hide(endCallForEveryoneButton);
    BUTTONS.settings.activeRooms ? show(activeRoomsButton) : hide(activeRoomsButton);
    if (BUTTONS.settings.videoSharing) {
        show(tabVideoShareBtn);
        show(videoShareButton);
    } else {
        hide(tabVideoShareBtn);
        hide(videoShareButton);
        hide(videoCloseBtn);
    }
    if (BUTTONS.settings.tabRTMPStreamingBtn) {
        show(tabRTMPStreamingBtn);
        show(startRtmpButton);
        show(startRtmpURLButton);
        show(streamerRtmpButton);
    } else {
        hide(tabRTMPStreamingBtn);
    }
    BUTTONS.settings.lockRoomButton ? show(lockRoomButton) : hide(lockRoomButton);
    BUTTONS.settings.unlockRoomButton ? show(unlockRoomButton) : hide(unlockRoomButton);
    BUTTONS.settings.broadcastingButton ? show(broadcastingButton) : hide(broadcastingButton);
    BUTTONS.settings.lobbyButton ? show(lobbyButton) : hide(lobbyButton);
    BUTTONS.settings.sendEmailInvitation ? show(sendEmailInvitation) : hide(sendEmailInvitation);
    !BUTTONS.settings.micOptionsButton && hide(micOptionsButton);
    !BUTTONS.settings.tabNotificationsBtn && hide(tabNotificationsBtn);
    BUTTONS.settings.tabModerator ? show(tabModeratorBtn) : hide(tabModeratorBtn);
    if (BUTTONS.settings.host_only_recording) {
        show(recordingImage);
        show(roomRecordingOptions);
        show(roomHostOnlyRecording);
    } else {
        show(recordingImage);
        show(roomRecordingOptions);
        hide(roomHostOnlyRecording);
    }
    BUTTONS.participantsList.saveInfoButton ? show(participantsSaveBtn) : hide(participantsSaveBtn);
    if (BUTTONS.whiteboard.whiteboardLockButton) {
        wbIsLock ? show(whiteboardLockBtn) : show(whiteboardUnlockBtn);
        wbIsLock ? hide(whiteboardUnlockBtn) : hide(whiteboardLockBtn);
        setColor(whiteboardLockBtn, wbIsLock ? 'red' : 'white');
    } else {
        hide(whiteboardLockBtn);
        hide(whiteboardUnlockBtn);
    }
    //...
}

function handleRulesBroadcasting() {
    console.log('07.2 ----> handleRulesBroadcasting');
    BUTTONS.main.shareButton = false;
    BUTTONS.main.hideMeButton = false;
    BUTTONS.main.startAudioButton = false;
    BUTTONS.main.startVideoButton = false;
    BUTTONS.main.startScreenButton = false;
    BUTTONS.main.swapCameraButton = false;
    //BUTTONS.main.raiseHandButton = false;
    BUTTONS.main.whiteboardButton = false;
    BUTTONS.main.documentPiPButton = false;
    //BUTTONS.main.snapshotRoomButton = false;
    //BUTTONS.main.emojiRoomButton = false,
    //BUTTONS.main.pollButton = false;
    BUTTONS.main.transcriptionButton = false;
    BUTTONS.main.settingsButton = false;
    BUTTONS.main.endCallForEveryoneButton = false;
    BUTTONS.participantsList.saveInfoButton = false;
    BUTTONS.settings.lockRoomButton = false;
    BUTTONS.settings.unlockRoomButton = false;
    BUTTONS.settings.lobbyButton = false;
    BUTTONS.settings.tabRTMPStreamingBtn = false;
    BUTTONS.settings.tabNotificationsBtn = false;
    BUTTONS.videoOff.muteAudioButton = false;
    BUTTONS.videoOff.geolocationButton = false;
    BUTTONS.videoOff.banButton = false;
    BUTTONS.videoOff.ejectButton = false;
    BUTTONS.consumerVideo.sendMessageButton = false;
    BUTTONS.consumerVideo.sendFileButton = false;
    BUTTONS.consumerVideo.sendVideoButton = false;
    BUTTONS.consumerVideo.geolocationButton = false;
    BUTTONS.consumerVideo.banButton = false;
    BUTTONS.consumerVideo.ejectButton = false;
    BUTTONS.consumerVideo.muteAudioButton = false;
    BUTTONS.consumerVideo.muteVideoButton = false;
    BUTTONS.whiteboard.whiteboardLockButton = false;
    //...
    elemDisplay('shareButton', false);
    elemDisplay('hideMeButton', false);
    elemDisplay('startAudioButton', false);
    elemDisplay('stopAudioButton', false);
    elemDisplay('startVideoButton', false);
    elemDisplay('stopVideoButton', false);
    elemDisplay('startScreenButton', false);
    elemDisplay('stopScreenButton', false);
    elemDisplay('swapCameraButton', false);
    //elemDisplay('raiseHandButton', false);
    elemDisplay('whiteboardButton', false);
    elemDisplay('documentPiPButton', false);
    //elemDisplay('snapshotRoomButton', false);
    //elemDisplay('emojiRoomButton', false);
    //elemDisplay('pollButton', false);
    //elemDisplay('editorButton', false);
    elemDisplay('transcriptionButton', false);
    elemDisplay('lockRoomButton', false);
    elemDisplay('unlockRoomButton', false);
    elemDisplay('lobbyButton', false);
    elemDisplay('settingsButton', false);
    elemDisplay('endCallForEveryoneButton', false);
    elemDisplay('tabRTMPStreamingBtn', false);
    elemDisplay('tabNotificationsBtn', false);

    elemDisplay('startVideoDeviceDropdown', false);
    elemDisplay('startAudioDeviceDropdown', false);
    elemDisplay('settingsExtraDropdown', false);
}
