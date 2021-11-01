import { css } from 'styled-components'

const CORNER_SIZE = 5

export const clipCorners = css<{ cornerSize?: number }>`
  position: relative;
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: ${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    bottom: ${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    left: -${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    right: -${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    background-color: inherit;
    z-index: -1;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: -${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    bottom: -${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    left: ${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    right: ${({ cornerSize }) => cornerSize ?? CORNER_SIZE}px;
    background-color: inherit;
    z-index: -1;
  }
`
