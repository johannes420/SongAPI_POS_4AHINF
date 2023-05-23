package com.example.SongAPI;


import org.springframework.data.mongodb.repository.MongoRepository;

public interface SongRepository extends MongoRepository<SongApp, String> {
}
