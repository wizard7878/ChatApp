defmodule ChatAppWeb.RegistartionController do
  use ChatAppWeb, :controller

  alias ChatApp.Accounts

  def new(conn , _) do
    render(conn, "new.html" , changeset: conn)
  end

  def create(conn , %{"registartion" => registartion_params}) do
    case Accounts.register(registartion_params) do
      {:ok , user} ->
        conn
        |> put_session(:current_user_id , user.id)
        |> put_flash(:info, "You have signed up and signed in!")
        |> redirect(to: Routes.room_path(conn , :index))
      {:error , changeset} ->
          render(conn,"new.html" , changeset: changeset)
    end
  end
end