import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Shield, Clock, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about our commitment to providing quality spare parts and exceptional service.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
                Our Story
                <Badge variant="secondary">Since 2014</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Founded with a passion for automotive excellence, HexaDrive has been serving
                vehicle owners and mechanics for over a decade. We started as a small family business
                and have grown into a trusted provider of high-quality spare parts across the region.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To provide premium quality spare parts at competitive prices while ensuring fast,
                reliable delivery and exceptional customer service. We believe that every vehicle
                deserves the best parts to keep it running safely and efficiently.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Why Choose Us?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Extensive catalog of genuine and aftermarket parts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Fast and reliable shipping nationwide
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Expert technical support and guidance
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Competitive pricing with quality guarantee
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Easy online ordering and tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <Badge className="mb-2">Quality</Badge>
                  <h3 className="font-semibold text-gray-800 mb-2">Quality First</h3>
                  <p className="text-sm text-gray-600">
                    We never compromise on the quality of our products
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <Badge className="mb-2">Reliability</Badge>
                  <h3 className="font-semibold text-gray-800 mb-2">Always Reliable</h3>
                  <p className="text-sm text-gray-600">
                    Dependable service you can count on every time
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <Lightbulb className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <Badge className="mb-2">Innovation</Badge>
                  <h3 className="font-semibold text-gray-800 mb-2">Forward Thinking</h3>
                  <p className="text-sm text-gray-600">
                    Staying ahead with the latest automotive technology
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}