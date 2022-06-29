import React from 'react'
import {Container} from 'react-bootstrap'
import { Navbar } from 'react-bootstrap'

export const NavbarMenu = () => {
  return (
    <div>
      <Navbar bg='dark' variant='dark' sticky='top' expand='md'>
          <Container>
              <Navbar.Brand href='/'>
                <img src='/gold_coin.png' width='30'height='30'/>{' '}
                  Binance Smart Chain
              </Navbar.Brand>
          </Container>
        </Navbar>
    </div>
  )
}
