defmodule ChatApp.Talk do
  alias ChatApp.Talk.Room
  alias ChatApp.Repo

  def list_rooms do
    Repo.all(Room)
  end

  def create_room(attrs \\ %{}) do
    %Room{}
    |> Room.changeset(attrs)
    |> Repo.insert()
  end

  def get_room!(id) do
    Repo.get!(Room, id)
  end

end