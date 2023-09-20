defmodule ExampleWeb.ControlChannel do
  use ExampleWeb, :channel

  require Logger

  @impl true
  def join("control:slider", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("slider_input", payload, socket) do
    broadcast(socket, "slider_input", payload)
    {:noreply, socket}
  end

  def handle_in(unexpected, payload, socket) do
    Logger.error("Received unexpected message #{unexpected}"
      <> " with payload #{inspect(payload)}")
    {:noreply, socket}
  end

end
