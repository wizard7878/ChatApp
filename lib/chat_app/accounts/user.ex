defmodule ChatApp.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias ChatApp.Accounts.User

  schema "users" do
    field :email, :string
    field :password_hash, :string
    field :username, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string , virtual: true
    has_many :rooms , ChatApp.Talk.Room

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :username])
    |> validate_required([:email, :username])
    |> unique_constraint(:email)
    |> unique_constraint(:username)
  end

  def registration_changeset(%User{} = user , attrs) do
    user
    |> changeset(attrs)
    |> validate_confirmation(:password_hash)
    |> cast(attrs , [:password_hash] , [])
    |> validate_length(:password_hash, min: 6, max: 100)
  end
end
