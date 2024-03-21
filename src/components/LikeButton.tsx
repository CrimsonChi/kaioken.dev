import { useEffect, useRef, useState } from "kaioken"
import { HeartIcon } from "./icons/HeartIcon"
import "./LikeButton.css"

export function LikeButton({
  liked,
  toggleLiked,
}: {
  liked: boolean
  toggleLiked: () => void
}) {
  const prevLiked = useRef(liked)
  const [justLiked, setJustLiked] = useState(false)
  useEffect(() => {
    if (liked !== prevLiked.current) {
      setJustLiked(liked)
      prevLiked.current = liked
    }
  })

  return (
    <button
      data-liked={liked}
      just-liked={justLiked}
      role="none"
      className="like-button flex transition transform active:scale-90 active:opacity-75"
      onclick={toggleLiked}
    >
      <HeartIcon />
    </button>
  )
}
