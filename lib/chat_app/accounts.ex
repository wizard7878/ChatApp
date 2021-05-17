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
end