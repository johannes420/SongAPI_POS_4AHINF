package com.example.SongAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class SongController {
    @RequestMapping("/home")
    public String serviceTest(){
        return "Das Service funktioniert!";
    }

    @Autowired
    private SongService songService;


    @RequestMapping("/getAllSongs")
    public List<SongApp> getallAuto() {
        return songService.getallSongs();
    }

    @RequestMapping("/getSong/{id}")
    public Optional<SongApp> getAuto(@PathVariable String id) {
        return songService.getSong(id);
    }

    @RequestMapping(method= RequestMethod.POST, value="/addSong")
    public String addSong(@RequestBody SongApp song) {
        songService.addSong(song);
        String response = "{\"success\": true, \"message\": Song has been added successfully.}";
        return response;
    }

    @RequestMapping(method=RequestMethod.PUT, value="/updateSong/{id}")
    public String updateSong(@RequestBody SongApp song, @PathVariable String id) {
        songService.updateSong(id, song);
        String response = "{\"success\": true, \"message\": Song has been updated successfully.}";
        return response;
    }

    @DeleteMapping(value="/deleteSong/{id}")
    public String deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
        String response = "{\"success\": true, \"message\": Song has been deleted successfully.}";
        return response;
    }

    @DeleteMapping(value="/deleteAllSongs")
    public String deleteAllSongs() {
        songService.deleteAllSongs();
        String response = "{\"success\": true, \"message\": Every Song has been deleted successfully.}";
        return response;
    }
}
