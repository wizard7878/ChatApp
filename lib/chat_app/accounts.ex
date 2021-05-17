defmodule ChatApp.Accounts do
  alias ChatApp.Repo
  alias ChatApp.Accounts.User

  def sign_in(email , password) do
    user = Repo.get_by(User , email: email)
    cond do
      user && user.password_hash ->
        {:ok , user}
      true ->
        {:error, :unauthorized}
    end
  end

  def user_signed_in?(conn) do
    !!current_user(conn)
  end

  def current_user(conn) do
    user_id = Plug.Conn.get_session(conn, :current_user_id)
    if user_id do
      Repo.get(User, user_id)
    end
  end

  def sign_out(conn) do
    Plug.Conn.configure_session(conn , drop: true)
  end

  def register(attrs) do
    User.registration_changeset(%User{} , attrs)
    |> Repo.insert()
  end

end