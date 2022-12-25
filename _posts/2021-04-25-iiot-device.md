---
layout: post
current: post
cover: assets/images/iiot_samples.jpg
navigation: True
title: Wireless Data Transceiver using LoRa mesh
date: 2021-04-25 10:18:00
tags: [Projects]
class: post-template
subclass: 'post'
author: Atharva Pusalkar
---

I worked on an industrial-grade wireless data transceiver using the LoRa mesh technology for use in ship docking systems.

## Description
The product mainly serves as an data-collection/transmission device using the PIC32 MCU and mesh networking topology. The PIC MCUs are outdated but they have excellent compatibility with the peripherals of our PCB, and hence it was chosen.

The board is attached with an ultrasonic sensors to measure ship distance from docks and transmit to a central aggregator node. The data is transmitted using the MODBUS protocol and the mesh topology allows for distances greater than a kilometer which is a requirement for deployments in oceanic areas. The device's end goal is to determine the number of ships that are currently docked using the calculated distance from a fixed position and count their in and out times. In addition to this, these modules can also be installed in smart power meters across a large area to connect them to the cloud and provide energy usage characteristics on a dashboard. All meters in the mesh network transmit the data reliably and securely to a central collection platform. This is particularly helpful in urban areas with tall high rises where networks such as Zigbee have range issues and low penetration power.

Here's an example deployment:
![](assets/images/iiot_mesh_deployment.png)

The LoRa end-nodes (EN) communicate with the Gateway using the LoRa physical layer. These gateways are connected to a network server over IP-backhaul with a high throughput, such as 
Ethernet or a cellular network. These gateways interpret the packets and send the data packets to the backend cloud architecture using the MQTT protocol.

A proposed end-node solution using a LoMesh data modem:
![](assets/images/iiot_modem.png)

Deployed use case scenario:
![](assets/images/iiot_samples.jpg)
The device has operational capability at 868 MHz as well as 2.4 GHz in India. The ultrasonic sensor being used is the A01NYUB by DFRobot. Interfaces such as SPI and USB are provided to connect with the end device.

## Testing
Some highlights...
<video width="75%" height="75%" controls>
  <source src="assets/videos/iiot_testing.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

![](assets/images/iiot_pcb.jpg)

![](assets/images/iiot_delivery.jpg)

## Outcome
I joined the team a year later after it was created, but I worked on some interesting tasks. I integrated the ultrasonic sensor - both software and hardware, added the capability for over-the-air updates, and MISRA C compliance. Some other improvements were also done to the MODBUS transmission procedure.

Getting the components, and working with the different radio bands in North America, Europe and Asia was an arduous task and COVID did not help either. Nonetheless, working on this product was fun and we already have clients from Switzerland, Canada, and India. Besides, I also got a look into the workflow of embedded programming happening at the Ford Motor Company (One of my mentor works at the company).

Thank you for reading.
