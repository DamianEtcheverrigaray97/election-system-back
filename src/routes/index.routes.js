const { Router } = require('express');
const adminRoutes = require('./admin.routes');
const votesRoutes = require('./votes.routes');
const votersRoutes = require('./voters.routes');

const routes_init = () => {
    const router = Router();

    router.use("/admin", adminRoutes);
    router.use("/votes", votesRoutes);
    router.use("/voters", votersRoutes);

    return router;
}

module.exports = { routes_init }
