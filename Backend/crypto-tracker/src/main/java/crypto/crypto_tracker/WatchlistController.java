package crypto.crypto_tracker;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {
    private final WatchlistRepository repository;

    public WatchlistController(WatchlistRepository repository) {
        this.repository = repository;
    }

    // CREATE
    @PostMapping
    public WatchlistItem addToWatchlist(@RequestBody WatchlistItem item) {
        return repository.save(item);
    }

    // READ (All for user)
    @GetMapping("/{userId}")
    public List<WatchlistItem> getUserWatchlist(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<WatchlistItem> updateItem(
            @PathVariable Long id,
            @RequestBody WatchlistItem updatedItem) {
        return repository.findById(id)
                .map(item -> {
                    item.setTargetPrice(updatedItem.getTargetPrice());
                    item.setNotes(updatedItem.getNotes());
                    return ResponseEntity.ok(repository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}