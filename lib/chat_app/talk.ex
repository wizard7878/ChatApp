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

  def update_room(%Room{} = room , attrs) do
    room
    |> Room.changeset(attrs)
    |> Repo.update()
  end

  def delete_room(id) do
    get_room!(id)
    |> Repo.delete()
  end

  def change_room(%Room{} = room) do
    Room.changeset(room , %{})
  end

end