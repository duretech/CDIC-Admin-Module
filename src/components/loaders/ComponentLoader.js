import React from "react"
import { ColorRing, RotatingLines } from 'react-loader-spinner'

import { Card, Container } from "react-bootstrap"
import { CardBody } from "reactstrap";
const ComponentLoader = () => {

    return (
        <Card className={`component-loader bg-darkblue border-0 infoIcon h-400 overflow-auto`}>
            <CardBody>
                <Container>

                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="30"
                        visible={true}
                    />
                </Container>
            </CardBody>
        </Card>
    )
}
export default ComponentLoader
