defmodule ExampleWeb.PageController do
  use ExampleWeb, :controller

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false)
  end

  def sliders(conn, _params) do
    conn
    |> assign(:page_title, "Sliders")
    |> assign(:n_sliders, 8)
    |> render(:sliders, layout: false)
  end
end
