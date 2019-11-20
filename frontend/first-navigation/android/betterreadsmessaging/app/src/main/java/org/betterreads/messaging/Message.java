package org.betterreads.messaging;

/*
 * CODE FROM: https://www.scaledrone.com/blog/android-chat-tutorial/
 */

public class Message {
    private String text; // message body
    private String member; // data of the user that sent this message
    private boolean belongsToCurrentUser; // is this message sent by us?

    public Message(String text, String memberData, boolean belongsToCurrentUser) {
        this.text = text;
        this.member = memberData;
        this.belongsToCurrentUser = belongsToCurrentUser;
    }

    public String getText() {
        return text;
    }

    public String getMember() {
        return member;
    }

    public boolean isBelongsToCurrentUser() {
        return belongsToCurrentUser;
    }
}