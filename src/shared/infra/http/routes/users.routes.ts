import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateUserController } from "@modules/accounts/useCases/createUser/CreateUserController";
import { UpdateUserAvatarController } from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController";
import { ProfileUserController } from "@modules/accounts/useCases/profileUser/ProfileUserController";

import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { celebrate, Segments, Joi } from 'celebrate';
const usersRoutes = Router();
const uploadAvatar = multer(uploadConfig);
const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const profileUserController = new ProfileUserController();


usersRoutes.post("/",
celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date(),
  },
}), createUserController.handle);
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  updateUserAvatarController.handle
);
usersRoutes.get("/profile", ensureAuthenticated, profileUserController.handle
)
usersRoutes.get("/",async (req, res) => {
  const message = {
    user: { id: 1, name: 'Diego Fernandes' },
    course: 'Kafka com Node.js',
    grade: 10,
  };

  // Chamar micro serviço
  await req.producer.send({
    topic: 'issue-certificate',
    messages: [
      { value: JSON.stringify(message) },
    ],
  })

  return res.json({ ok: true });
})
export { usersRoutes };
