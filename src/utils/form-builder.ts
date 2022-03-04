export const initialiseVisibility = ({ formInputs, renderedInputs }) => {
  const publishers = formInputs.filter((fi) => fi.publisher)

  for (let pubIndex = 0; pubIndex < publishers.length; pubIndex++) {
    renderedInputs = formInputs.filter((observer) => {
      return conditionalRendering(
        observer,
        publishers[pubIndex],
        publishers[pubIndex].value
      )
    })
  }

  return renderedInputs
}

export const conditionalRendering = (observer: any, input: any, value: any) => {
  const condition = observer.conditional_visibility
  if (condition && condition.observing === input.key) {
    const visibility = value === condition.value
    observer.visibility = visibility
    return visibility
  } else {
    return observer.visibility
  }
}
