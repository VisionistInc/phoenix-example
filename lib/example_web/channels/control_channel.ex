defmodule ExampleWeb.ControlChannel do
  use ExampleWeb, :channel

  require Logger

  @impl true
  def join("control:slider", payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("slider_input", %{"n" => _n, "value" => _value} = payload, socket) do
    broadcast(socket, "slider_input", payload)
    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (control:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

end
