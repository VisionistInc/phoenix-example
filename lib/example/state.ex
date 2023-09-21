defmodule Example.State do

  def n_sliders, do: 7

  def clock_bpm, do: 90

  # 60k ms/minute
  def clock_ms, do: floor(60_000 / __MODULE__.clock_bpm)

end
