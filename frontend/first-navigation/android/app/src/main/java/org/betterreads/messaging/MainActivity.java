package org.betterreads.messaging;

/*
 * CODE FROM: https://www.scaledrone.com/blog/android-chat-tutorial/
 *
 * Also, most layout / drawable code from same source.
 *
 * Customization and integration with Mongo by @soshay.
 */

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.view.View;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.DataOutputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class MainActivity extends AppCompatActivity {
    private final int OVERLAY_PERMISSION_REQ_CODE = 1;
    protected Context getSelf() {
        return this;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        update();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
        }
        Intent intent = new Intent(this, MyReactActivity.class);
        startActivity(intent);
    }

    public void sendMessage(View view) {
        EditText messageBox = (EditText) findViewById(R.id.messageBox);

        DatabaseWrite task = new DatabaseWrite();
        task.execute(messageBox.getText().toString());
    }

    protected void forceUpdate() {
        DatabaseAccess task = new DatabaseAccess();
        try {
            task.execute(new URL("http://10.0.2.2:3000/api/get_messages/8/1"));
        } catch (MalformedURLException e) {
            System.err.println("Malformed URL");
        }
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(this)) {
                    Toast.makeText(this, "You cannot open the React Native app as you have denied the permission", Toast.LENGTH_SHORT).show();
                }
            }
        }
    }
    protected void update() {
        final Handler handler = new Handler();

        final Runnable handlerTask = new Runnable() {
            @Override
            public void run() {
                DatabaseAccess task = new DatabaseAccess();
                try {
                    task.execute(new URL("http://10.0.2.2:3000/api/get_messages/8/1"));
                } catch (MalformedURLException e) {
                    System.err.println("Malformed URL");
                }
                handler.postDelayed(this, 10 * 1000);
            }
        };
        handlerTask.run();
    }

    public class DatabaseAccess extends AsyncTask<URL, String, JSONObject> {
        @Override
        protected JSONObject doInBackground(URL... urls) {
            try {
                // get the first URL from the array
                URL url = urls[0];
                // create connection and send HTTP request
                HttpURLConnection conn =
                        (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.connect();

                // read first line of data that is returned
                Scanner in = new Scanner(url.openStream());
                String jtext = "";
                while (in.hasNext()) {
                    jtext += in.next();
                }
                JSONObject json = new JSONObject(jtext);
                return json;
            }
            catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        /*
        This method is called in foreground after doInBackground finishes.
        It can access and update Views in user interface.
        */
        @Override
        protected void onPostExecute(JSONObject json) {
            super.onPostExecute(json);
            ListView history = (ListView) findViewById(R.id.messages);
            // not implemented but you can use this if you’d like
            String[] messages = new String[10];

            MessageAdapter adapter = new MessageAdapter(getSelf());

            try {
                String owner = (String) json.get("user");
                JSONArray msgs = json.getJSONArray("msgs");
                for (int i = 0; i < msgs.length(); i++) {
                    JSONObject obj = msgs.getJSONObject(i);
                    String sender = obj.get("from_uuid").toString();
                    boolean isOwner = true;
                    if (!sender.equals(owner)) {
                        isOwner = false;
                    }
                    adapter.add(new Message((String) obj.get("message"), sender, isOwner));
                }
                history.setAdapter(adapter);
            }
            catch (Exception e) {
                e.printStackTrace();
                return;
            }
        }
    }

    public class DatabaseWrite extends AsyncTask<String, String, String> {
        @Override
        protected String doInBackground(String... strs) {
            /*
             * POST CODE FROM: https://stackoverflow.com/questions/4205980/java-sending-http-parameters-via-post-method-easily
             */
            try {
                URL url = new URL("http://10.0.2.2:3000/api/send_message/8/1");
                String params  = "msg=" + strs[0];
                System.err.println(params);

                byte[] post = params.getBytes(StandardCharsets.UTF_8);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setDoOutput(true);
                conn.setInstanceFollowRedirects(true);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                conn.setRequestProperty("charset", "utf-8");
                conn.setRequestProperty("Content-Length", Integer.toString(post.length));
                conn.setUseCaches(false);
                conn.connect();

                OutputStream oStream = conn.getOutputStream();
                DataOutputStream wr = new DataOutputStream(oStream);
                wr.write(post);
                wr.flush();
                wr.close();
                System.err.println(conn.getResponseCode());

            }
            catch (Exception e) {
                e.printStackTrace();
            }
            return "";
        }

        /*
        This method is called in foreground after doInBackground finishes.
        It can access and update Views in user interface.
        */
        @Override
        protected void onPostExecute(String msg) {
            EditText inputBox = (EditText) findViewById(R.id.messageBox);
            inputBox.setText("");
            forceUpdate();
        }
    }

}
