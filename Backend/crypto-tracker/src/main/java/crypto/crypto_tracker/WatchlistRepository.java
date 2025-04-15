package crypto.crypto_tracker;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserId(String userId);
    boolean existsByCoinIdAndUserId(String coinId, String userId);
}