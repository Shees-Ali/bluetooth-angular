/// <reference types="web-bluetooth" />
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'bluetooth-poc-angular';
  deviceName: string | undefined = '';
  batteryPercent: number | undefined = undefined;
  isError: boolean = false;
  async requestDevice() {
    try {
      this.isError = false;
      const device = await navigator.bluetooth.requestDevice({
        optionalServices: ['battery_service', 'device_information'],
        acceptAllDevices: true,
      });
      console.log('PARIED DEVICE', device);
      this.deviceName = device?.gatt?.device.name;
      console.log('DEVICE NAME', this.deviceName);
      const server = await device?.gatt?.connect();
      const batteryService = await server?.getPrimaryService('battery_service');
      const batteryLevelCharacteristic =
        await batteryService?.getCharacteristic('battery_level');
      const batteryLevel = await batteryLevelCharacteristic?.readValue();
      console.log('Battery Level', batteryLevel);
      this.batteryPercent = await batteryLevel?.getUint8(0);
      console.log('Battery Percent', this.batteryPercent);
    } catch (err) {
      console.error(err);
      this.isError = true;
    }
  }
}
