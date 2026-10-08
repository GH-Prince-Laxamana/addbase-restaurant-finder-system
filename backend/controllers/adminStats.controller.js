import {
  getAdminOverview,
  getAdminRestaurantStats,
} from "../services/adminStats.service.js";

export async function overviewStats(req, res) {
  const stats = await getAdminOverview();

  res.json({
    stats,
  });
}

export async function restaurantStats(req, res) {
  const stats = await getAdminRestaurantStats(req.query);

  res.json({
    stats,
  });
}
