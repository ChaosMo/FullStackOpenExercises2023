import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component tests', () => {
  let blog = {
    title:"React patterns",
    author:"Michael Chan",
    url:"https://reactpatterns.com/",
    likes:7
  }

  let mockUpdateBlog = jest.fn()
  let mockDeleteBlog = jest.fn()

  //5.13: Blog list tests, step1
  test('renders title and author', () => {
    const component = render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    )
    expect(component.container).toHaveTextContent(
      'React patterns - Michael Chan'
    )
  })

  //5.14: Blog list tests, step2
  test('clicking the view button displays url and number of likes', () => {
    const component = render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'https://reactpatterns.com/'
    )

    expect(component.container).toHaveTextContent(
      '7'
    )
  })
  //5.15: Blog list tests, step3

  //5.16: Blog list tests, step4
})