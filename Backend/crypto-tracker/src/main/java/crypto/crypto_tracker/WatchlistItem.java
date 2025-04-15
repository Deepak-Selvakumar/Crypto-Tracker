package crypto.crypto_tracker;
        import lombok.*;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "watchlist_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String coinId;  // e.g., "bitcoin"

    @Column(nullable = false)
    private String userId;  // For future auth (hardcode for now)

    private Double targetPrice;  // Custom field for CRUD
    private String notes;       // Custom field for CRUD
}