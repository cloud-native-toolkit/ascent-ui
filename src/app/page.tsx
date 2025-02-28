"use client"

import Image from "next/image";
import Link from "next/link";

import {useAtomValue} from "jotai";
import {Button, Column, FlexGrid, ListItem, Row, UnorderedList} from "@carbon/react";
import {Cloud, Login, ModelBuilder, SankeyDiagramAlt} from "@carbon/icons-react";

import styles from "./page.module.scss";

import {InfoCard, InfoSection} from "@/components";

import ascentImg from '../images/ascent.jpeg'
import {currentUserAtom} from "@/atoms";

export default function Home() {
  const {data: user, isLoading} = useAtomValue(currentUserAtom)

  return (
        <FlexGrid fullWidth={true}>
          <Row className={styles.landingPage__banner} style={{ paddingBottom: '2rem' }}>
            <Column lg={{ span: 12 }}>
              <h1 className={styles.landingPage__heading}>
                TechZone Deployer
              </h1>
              <h2 className={styles.landingPage__subheading}>
                Create composite multi-cloud solutions rapidly with automation that deploys IBM Software
              </h2>
            </Column>
          </Row>
          <Row className={styles.landingPage__tabContent}>
            <Column lg={{ span: 6 }} sm={{ span: 12 }}>

              <h2 className={styles.landingPage__subheading}>
                What can you do with Accelerator Toolkit automation ?
              </h2>
              <p className={styles.landingPage__p}>
                The  automation  provides a simple experience for the creation of common architecture patterns for software and cloud infrastructures to enable
                rapid composite solution creation using common automation techniques
              </p>
              <UnorderedList nested>
                <ListItem>
                  Enables the fast creation of solution automation ready for production state environments
                </ListItem>
                <ListItem>
                  Provides a set of cloud infrastructure reference architectures for AWS, Azure and IBM Cloud including Quick Start, Standard and Advanced patterns
                </ListItem>
                <ListItem>
                  Provides a set of composite IBM Software architectures for common client and partner use-cases
                </ListItem>
              </UnorderedList>

              <h2 className={styles.landingPage__subheading}>
                Why do we need automation ?
              </h2>
              <p className={styles.landingPage__p}>
                To help speed up the delivery and adoption of IBM Technology on multiple cloud environment including AWS, Azure and IBM Cloud.
                Support the co-creation of composite solutions with Clients and IBM Partners. Provide consistent automation across clouds infrastructures
                and software architectures.
              </p>

              {user ? <Link href="/solutions/new" ><Button>Create a Solution</Button></Link> : isLoading ? <div>Loading user...</div> : <Button href="/login" renderIcon={Login}>Login</Button>}


            </Column>
            <Column lg={{ span: 6 }} sm={{ span: 12 }}>
              <Image src={ascentImg} alt="Tool illustration" className={styles.landingPage__illo} />
            </Column>
          </Row>
          <Row className={styles.landingPage__tabContent}>
            <Column lg={{ span: 12 }}>
              <InfoSection heading="The Principles" className={styles.landingPage__r3}>

                <InfoCard
                    heading="Reference Architectures"
                    body="Build your solutions using our pre-defined reference architectures for AWS, Azure or IBM Cloud. Learn more about how your architecture meets your regulatory compliance and risk management obligations."
                    icon={user ? <Link href="/boms/software" ><ModelBuilder /></Link> : <ModelBuilder />}
                />

                <InfoCard
                    heading="Cloud Infrastructures and Software"
                    body="Consume the Software Everywhere  module catalog, assemble them into your own custom reference architectures and deploy them in minutes using the infrascture as code bundles built by the solution builder!"
                    icon={user ? <Link href="/services" ><Cloud /></Link> : <Cloud />}
                />

                <InfoCard
                    heading="Security Controls"
                    body="The IBM Cloud Framework for Financial Services provides a set of pre-configured compliance controls that are adhered to by the entire ecosystem — financial institutions, cloud services, and the digital supply chain of ISVs and SaaS providers."
                    icon={user ? <Link href="/controls" ><SankeyDiagramAlt /></Link> : <SankeyDiagramAlt />}
                />
              </InfoSection>
            </Column>
          </Row>
        </FlexGrid>
  );
}
