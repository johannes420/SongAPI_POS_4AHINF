using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace SongWPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<Song> songList = new List<Song>();




        public MainWindow()
        {
            InitializeComponent();

        }

        public void clearBoxes()
        {
            Titel.Clear();
            Artist.Clear();
            Genre.Clear();
            Album.Clear();
        }

        public void tableClick(object sender, RoutedEventArgs e)
        {
            Song selectedSong = (Song)table.SelectedItems[0];
            Titel.Text = selectedSong.Titel;
            Artist.Text = selectedSong.Artist;
            Genre.Text = selectedSong.Genre;
            Album.Text = selectedSong.Album;
            AlbumBox.IsChecked = true;
        }
        public void loadSongs()
        {
            HttpClient client = new HttpClient();
            string json = "";
            json = client.GetStringAsync("http://localhost:3020/getAllSongs").Result;

            songList = JsonConvert.DeserializeObject<List<Song>>(json);
            table.ItemsSource = songList;
        }
        public void loadSongsOnClick(object sender, RoutedEventArgs e)
        {
            loadSongs();
        }

        public async void addSong(object sender, RoutedEventArgs e)
        {
            Song song = new Song();

            

            if (string.IsNullOrEmpty(Titel.Text) || string.IsNullOrEmpty(Artist.Text) || string.IsNullOrEmpty(Genre.Text))
            {
                MessageBox.Show("Fill in all fields", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
                 
            }
            else if (AlbumBox.IsChecked == true && string.IsNullOrEmpty(Album.Text))
            {
                MessageBox.Show("Fill in all fields", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            else
            {
                if (AlbumBox.IsChecked == false)
                {
                    song.Album = "n/a";
                }
                else if (AlbumBox.IsChecked == true)
                {
                    song.Album = Album.Text;
                }

                song.Titel = Titel.Text;
                song.Artist = Artist.Text;
                song.Genre = Genre.Text;
                

                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.PostAsJsonAsync("http://localhost:3020/addSong", song);

                if (response.IsSuccessStatusCode)
                {
                    loadSongs();
                    clearBoxes();
                }
            }
        }

        public async void deleteSong(object sender, RoutedEventArgs e)
        {

            if (table.SelectedItems.Count == 0) 
            {
                MessageBox.Show("Select an Item", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            else { 
                if (MessageBox.Show("Do you want to delete this song?", "Delete", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
                {
                    HttpClient client = new HttpClient();
                    Song selectedSong = (Song)table.SelectedItems[0];
                    string songId = selectedSong.id;
                    HttpResponseMessage response = await client.DeleteAsync("http://localhost:3020/deleteSong/" + songId);
                    loadSongs();
                    if (response.IsSuccessStatusCode)
                    {
                        loadSongs();
                        clearBoxes();
                    }
                    else
                    {
                        MessageBox.Show("Failed to update song.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
            }

        }

        public async void updateSong(object sender, RoutedEventArgs e)
        {
            if (table.SelectedItems.Count == 0)
            {
                MessageBox.Show("Select an Item", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            else
            {
                if (string.IsNullOrEmpty(Titel.Text) || string.IsNullOrEmpty(Artist.Text) || string.IsNullOrEmpty(Genre.Text))
                {
                    MessageBox.Show("Fill in all fields", "Info", MessageBoxButton.OK, MessageBoxImage.Information);

                }
                else if (AlbumBox.IsChecked == true && string.IsNullOrEmpty(Album.Text))
                {
                    MessageBox.Show("Fill in all fields", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                {
                    HttpClient client = new HttpClient();
                    Song selectedSong = (Song)table.SelectedItems[0];
                    string id = selectedSong.id;
                    selectedSong.Titel = Titel.Text;
                    selectedSong.Artist = Artist.Text;
                    selectedSong.Genre = Genre.Text;
                    selectedSong.Album = Album.Text;

                    if(AlbumBox.IsChecked == false || selectedSong.Album == "")
                    {
                        selectedSong.Album = "n/a";
                    }



                    HttpResponseMessage response = await client.PutAsJsonAsync("http://localhost:3020/updateSong/{id}", selectedSong);

                    if (response.IsSuccessStatusCode)
                    {
                        loadSongs();
                        clearBoxes();
                    }
                    else
                    {
                        MessageBox.Show("Failed to update song.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
            }
        }
      
    }


    public class Song
    {
      
        public string id { get; set; }
        public string Titel { get; set; }

        public string Artist { get; set; }

        public string Genre { get; set; }

        public string Album { get; set; }
    }
}
