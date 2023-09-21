defmodule Slider do
  use Phoenix.Component  

  def vertical(assigns) do
    ~H"""
    <div>
      <div class="slider-container">
        <input type="range"
               min="0.0"
               max="1.0"
               value="0.0"
               step="0.001"
               class="slider-vertical"
               oninput="window.controlSliderInput(this);"
               data-n={@n} />
      </div>
      <div data-n={@n}
           class="slider-indicator slider-inactive" />
    </div>
    """
  end

end
