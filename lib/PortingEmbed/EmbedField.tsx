type Props = {
  children: React.ReactNode
}

export function EmbedField({ children }: Props) {
  // TODO: customizable classNames
  return (
    <div className="GigsEmbeds GigsPortingEmbed GigsEmbeds-field">
      {children}
    </div>
  )
}
