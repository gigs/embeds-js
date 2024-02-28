type Props = {
  error: string
}

export function EmbedFieldError({ error }: Props) {
  if (!error) {
    return null
  }

  // TODO: customizable classNames
  return (
    <div className="GigsEmbeds GigsPortingEmbed GigsEmbeds-fieldError">
      {error}
    </div>
  )
}
