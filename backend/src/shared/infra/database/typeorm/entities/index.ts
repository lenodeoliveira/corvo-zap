
import { USER_MODEL } from "@/modules/users/infra/database/sqlite/model"
import { CHAT_MODEL } from "@/modules/chat/infra/database/sqlite/model"
import { MESSAGE_MODEL } from "@/modules/messages/infra/database/sqlite/model"

export const DATABASE_ENTITIES = [...USER_MODEL, ...CHAT_MODEL, ...MESSAGE_MODEL]
