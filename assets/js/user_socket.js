// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import {Socket} from "phoenix"

// And connect to the path in "lib/example_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/example_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/example_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/example_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:
let channel = socket.channel("control:*", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

///////////////////////////////////////////////////////////////////////////////
// begin custom application code
///////////////////////////////////////////////////////////////////////////////

// unique key used for ignoring messages from ourself
// 
// note: was using crypto but JS is paranoid about calling it
// and we don't need the accuracy
// 
// window.controlClientId = crypto.randomUUID();
window.controlClientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

// oninput HTML event handler for sending slider messages:
window.controlSliderInput = (slider) => {
  const payload = {
    from: window.controlClientId,
    n: slider.dataset.n,
    value: slider.value
  };
  channel.push("slider_input", payload, 10000);
}

// slider input channel handler for receiving slider messages:
channel.on("slider_input", (msg) => {
  // ignore if it's from ourself, don't create a storm!
  if (msg.from == window.controlClientId) return;

  // build a query selector for the correct slider
  const selector = `.slider-vertical[data-n='${msg.n}']`;

  // find the slider and update its value
  const slider = window.document.querySelector(selector);
  slider.value = msg.value;
});

channel.on("clock_tick", (msg) => {
  // query for all indicators
  const selector = ".slider-indicator";
  window.document.querySelectorAll(selector).forEach((elem) => {
    if (msg.step == elem.dataset.n) {
      console.log(`${msg.step} is active`);
      elem.classList.remove("slider-inactive");
      elem.classList.add("slider-active");
    } else {
      elem.classList.remove("slider-active");
      elem.classList.add("slider-inactive");
    }
  });
});

///////////////////////////////////////////////////////////////////////////////
// end custom code
///////////////////////////////////////////////////////////////////////////////

export default socket
