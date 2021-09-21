export const ComposeModal = () => {
  return (
    <div style={{
      width: 100,
      height: '100%',
      backgroundColor: 'red',
      zIndex: -1,
      position: 'absolute',
      transform: 'translateX(calc(-100px - var(--spaced-columns-gap))',
    }}
    />
  )
}
