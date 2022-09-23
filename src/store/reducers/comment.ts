import { CommentPage } from '@/types/data'
import { RootAction } from '@/types/store'

type CommentState = {
  commentPage: CommentPage
}

const initState: CommentState = {
  commentPage: {
    end_id: '',
    last_id: '',
    results: [],
    total_count: 0
  }
}

export function commentReducer(
  state: CommentState = initState,
  action: RootAction
): CommentState {
    if(action.type === 'comment/set_comment_page'){
        return {
            ...state,
            commentPage: action.payload
        }
    }
  return state
}
