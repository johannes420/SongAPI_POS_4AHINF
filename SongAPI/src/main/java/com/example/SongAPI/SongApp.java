package com.example.SongAPI;
import org.springframework.data.annotation.Id;


public class SongApp {
    @Id
    private String id;
    private String titel;
    private String artist;
    private String genre;
    private String album;


    public SongApp(String id, String titel, String artist, String genre, String album) {
        super();
        this.id = id;
        this.titel = titel;
        this.artist = artist;
        this.genre = genre;
        this.album = album;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitel() {
        return titel;
    }

    public void setTitel(String titel) {
        this.titel = titel;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }
}
