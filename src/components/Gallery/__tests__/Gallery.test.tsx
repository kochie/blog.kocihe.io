import React from 'react'
import { create } from 'react-test-renderer'

import Gallery from '..'

it('renders correctly', () => {
  const tree = create(<Gallery articles={[]} />).toJSON()
  expect(tree).toMatchSnapshot()
})
