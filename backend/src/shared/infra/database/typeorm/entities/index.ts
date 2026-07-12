
import { USER_MODEL } from "@/modules/users/infra/database/typeorm/models"
import { CHAT_MODEL } from "@/modules/chat/infra/database/typeorm/models"
import { MESSAGE_MODEL } from "@/modules/messages/infra/database/typeorm/models"
import { CITY_MODEL } from "@/modules/cities/infra/database/typeorm/models"

export const DATABASE_ENTITIES = [...USER_MODEL, ...CHAT_MODEL, ...MESSAGE_MODEL, ...CITY_MODEL]
