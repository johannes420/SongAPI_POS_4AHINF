package com.example.SongAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
@Service
public class SongService {
        @Autowired
        private SongRepository SongRepository;

        private List<SongRepository> songs = new ArrayList<>(Arrays.asList());

        public List<SongApp> getallSongs() {
            return (List<SongApp>) this.SongRepository.findAll();
        }

        public Optional<SongApp> getSong(String id) {
            return this.SongRepository.findById(id);
        }

        public void addSong(SongApp song) {
            this.SongRepository.save(song);
        }

        public void updateSong(String id, SongApp song) {this.SongRepository.save(song);
        }
        public void deleteSong(String id) { this.SongRepository.deleteById(id); }

        public void deleteAllSongs(){this.SongRepository.deleteAll();}
}

