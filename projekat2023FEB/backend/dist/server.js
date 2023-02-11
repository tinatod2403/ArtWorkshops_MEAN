"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routers_1 = __importDefault(require("./routers/user.routers"));
const organizer_routers_1 = __importDefault(require("./routers/organizer.routers"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 500000 }));
app.use((0, cors_1.default)());
mongoose_1.default.connect('mongodb://127.0.0.1:27017/ArtWorkshop');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log("DB connection ok");
});
const router = express_1.default.Router();
router.use('/user', user_routers_1.default);
router.use('/organizer', organizer_routers_1.default);
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map