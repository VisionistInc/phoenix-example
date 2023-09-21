defmodule Example.Clock do
  alias Example.State
  alias ExampleWeb.ControlChannel

  use Task, restart: :permanent

  def start_link(_) do
    # kick off a long running blocking call:
    Task.start_link(&start_clock/0)
  end

  def start_clock do
    tick(0)
  end

  defp tick(count) do
    receive do
    after State.clock_ms ->
      rem(count, State.n_sliders) + 1
      |> ControlChannel.broadcast_tick()
      
      tick(count + 1)
    end
  end
      
end