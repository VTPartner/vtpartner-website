/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

const TermsAndConditionsCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="bg-white py-10" id="" data-baseweb="block">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="sm:text-3xl text-lg font-titillium text-gray-800">
            Welcome to VT PARTNER TRANS PVT LTD
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            These terms of service outline the rules and regulations for the use
            of VT PARTNER TRANS PVT LTD's Website. VT PARTNER TRANS PVT LTD is
            located at: Plot No- PAP -A45 Near Mahindra gate no -02 CHAKAN MIDC
            Nighoje., Pune-410501 Maharashtra, India By accessing our website,
            we assume you accept these terms of service in full. Do not continue
            to use VT PARTNER TRANS PVT LTD's website if you do not accept all
            of the terms of service stated on this page.<br></br> The following
            terminology applies to these Terms of Service, Privacy Statement and
            Disclaimer Notice and any or all Agreements: "Client", "You" and
            "Your" refers to you, the person accessing this website and
            accepting the Company's terms of service. "The Company",
            "Ourselves", "We", "Our" and "Us", refers to our Company. "Party",
            "Parties", or "Us", refers to both the Client and ourselves, or
            either the Client or ourselves. All terms refer to the offer,
            acceptance and consideration of payment necessary to undertake the
            process of our assistance to the Client in the most appropriate
            manner, whether by formal meetings of a fixed duration, or any other
            means, for the express purpose of meeting the Client's needs in
            respect of provision of the Company's stated services/products, in
            accordance with and subject to, prevailing law of India. Any use of
            the above terminology or other words in the singular, plural,
            capitalisation and/or he/she or they, are taken as interchangeable
            and therefore as referring to same. <br></br>WE WOULD LIKE TO
            CLARIFY THAT THESE USER TERMS WILL NOT APPLY TO CORPORATE ENTITIES
            WHO ARE GOVERNED BY THE VTPARTNER CORPORATE TERMS OF USE.HOWEVER ALL
            THE CUSTOMERS WHO ARE AVAILING SERVICES LIKE OBTAINING A RIDE OR
            SHIFITING OF GOODS UNDER THE DIRECT ARRANGEMENTS BETWEEN CORPORATE
            ENTITIES AND VTPARTNER SHALL ALSO BE GOVERNED BY THESE USER TERMS.
          </p>
        </div>
        {/* <div className="border-t border-gray-300"> */}
        <div className="">
          <ul className="accordion">
            {/* <li className="border-b border-gray-200"> */}
            <li className="">
              <div
                role="button"
                aria-expanded={isExpanded}
                onClick={toggleExpansion}
                className="flex justify-between items-center py-4 cursor-pointer transition hover:bg-gray-100"
              >
                <span className="font-bold text-sm">
                  Our Complete Terms and Conditions & Privacy Policy
                </span>
                <svg
                  viewBox="0 0 24 24"
                  title="Expand"
                  className={`transition-transform duration-200 ${
                    isExpanded ? "transform rotate-180" : ""
                  } w-6 h-6 text-gray-600`}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.9394 15.5607C11.5252 16.1464 12.4749 16.1464 13.0607 15.5607L17.0607 11.5607C17.6465 10.9749 17.6465 10.0251 17.0607 9.43934C16.4749 8.85355 15.5252 8.85355 14.9394 9.43934L12 12.3787L9.06069 9.43934C8.4749 8.85355 7.52515 8.85355 6.93937 9.43934C6.35358 10.0251 6.35358 10.9749 6.93937 11.5607L10.9394 15.5607Z"
                  />
                </svg>
              </div>
              {isExpanded && (
                <div className="py-4">
                  <span className="font-semibold text-sm">1. DEFINITIONS</span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <strong>• “Account”</strong> means the account created
                        by the Customer on the Application, IN ORDER TO AVAIL
                        the Services provided by VTPartner.
                      </li>
                      <li>
                        <strong>• “Additional Fee”</strong> may mean any toll,
                        duty, inter-state taxes, etc. required in providing the
                        Services and payable to any third party / government
                        authorities for undertaking the Ride under Applicable
                        Law.
                      </li>
                      <li>
                        <strong>• “Applicable Laws”</strong> shall mean and
                        include all applicable statutes, enactments, acts of
                        legislature or parliament, laws, ordinances, rules,
                        by-laws, regulations, notifications, guidelines,
                        policies, directions, directives and orders of any
                        governmental authority, tribunal, or a court of India.
                      </li>
                      <li>
                        <strong>• “Application”</strong> shall mean the mobile
                        application “VTPartner APP” updated timely basis needs
                        by VTPartner.
                      </li>
                      <li>
                        <strong>• “Cancellation Fee”</strong> shall mean a fee
                        payable by You, towards cancellation of a Ride or a
                        booking.
                      </li>
                      <li>
                        <strong>• “Customer/You”</strong> means a person who has
                        an Account on the Application.
                      </li>
                      <li>
                        <strong>• “Driver”</strong> shall mean and include such
                        individuals as may be evaluated, appointed and trained
                        by an operator associated with us to provide the
                        transportation services and persons who are registered
                        with VTPartner and own such Vehicles with necessary city
                        taxi permits and other applicable transport vehicle
                        permits and licenses to provide transportation services
                        within the Inter-City/Intracity of Operations.
                      </li>
                      <li>
                        <strong>• “E-Wallet”</strong> shall mean a pre-paid
                        instrument, which can be used to make payments or to
                        earn rewards during any promotional events.
                      </li>
                      <li>
                        <strong>• “Fare”</strong> shall mean such amount payable
                        by You in Indian Rupees, which is reflected on the
                        Application, as the fare payable towards the distance
                        travelled and time taken for the specific Ride. Fare may
                        depend on several factors such as the availability of
                        the Driver(s) on the platform at the time, city and may
                        also reflect the fares that may have been stipulated by
                        the respective Governments from time to time. It may
                        include components to reflect any promotions carried out
                        by VTPartner.
                      </li>
                      <li>
                        <strong>• “Force Majeure Event”</strong> shall mean any
                        event arising due to any cause beyond the reasonable
                        control of Ola.
                      </li>
                      <li>
                        <strong>• “Registration Data”</strong> shall mean and
                        may include the present, valid, true and accurate name,
                        email ID, phone number and such other information as may
                        be required by VTPartner from the Customer from time to
                        time for registration on the Application.
                      </li>
                      <li>
                        <strong>• “Service(s)”</strong> means the services
                        provided by VTPartner.
                      </li>
                      <li>
                        <strong>• “Ride”</strong> shall mean the travel in the
                        Vehicle by the Customer facilitated through the App or
                        website.
                      </li>
                      <li>
                        <strong>• "Carriage"</strong> means and includes the
                        whole of the operations and services undertaken by us in
                        connection with the Consignment.
                      </li>
                      <li>
                        <strong>• "Consignment"</strong> means any package,
                        parcel, sachet, or freight which is or are given to and
                        accepted by us for carriage under our Consignment Note.
                      </li>
                      <li>
                        <strong>• “Dangerous Goods”</strong> means goods
                        classified as dangerous as per ICAO T.I., IATA DGR,
                        IMDG-Code, ADR or other national regulations for
                        transport.
                      </li>
                      <li>
                        <strong>• “Delivery”</strong> means the tender of the
                        consignment to the consignee or intimation about the
                        arrival of the consignment.
                      </li>
                      <li>
                        <strong>• "Prohibited Items"</strong> means any goods or
                        materials, the Carriage of which is prohibited by
                        Applicable Law.
                      </li>
                      <li>
                        <strong>• “Receiver” or “Consignee”</strong> shall refer
                        to the recipient or addressee or the consignee of the
                        Consignment.
                      </li>
                      <li>
                        <strong>• “Applicable Law”</strong> means all laws,
                        statutes, ordinance, regulations, guidelines, policies,
                        rules, bye-laws, notifications, directions, directives
                        and orders or other governmental restrictions or any
                        similar form of decision of, or determination by, or any
                        interpretation, administration and other pronouncements
                        having the effect of law of the Republic of India or any
                        other applicable jurisdiction by state, municipality,
                        court, tribunal, government, ministry, department,
                        commission, arbitrator or board or such other body which
                        has the force of law in India.
                      </li>
                      <li>
                        <strong>• “Substitute Vehicle”</strong> shall mean
                        another vehicle arranged for transporting the Customers
                        to his/her destination, in the event of a Vehicle
                        breakdown.
                      </li>
                      <li>
                        <strong>• “Peak charge”</strong> shall mean additional
                        charge applied in the situation where the demand is more
                        than the available supply.
                      </li>
                      <li>
                        <strong>• “T&Cs” and “User Terms”</strong> shall mean
                        these Customer terms and conditions.
                      </li>
                      <li>
                        <strong>• “TPSP”</strong> shall mean a third-party
                        service provider.
                      </li>
                      <li>
                        <strong>• “Vehicle”</strong> shall mean a motor cab as
                        defined under the Motor Vehicles Act,1988.
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm">2. ELIGIBILITY</span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        You will be “Eligible” to use the Services only when You
                        fulfil all of the following conditions:
                      </li>
                      <li>
                        • You have attained at least 18 (eighteen) years of age.
                      </li>
                      <li>
                        • You will be asked to enter into a contract under the
                        Applicable Laws.
                      </li>
                      <li>
                        • Drivers must have a minimum experience of 2 Years of
                        Driving and should not possess any CRIMINAL Record.
                      </li>
                      <li>
                        If You reside in a jurisdiction that restricts the use
                        of the Service because of age, or restricts the ability
                        to enter into contracts such as this User Terms due to
                        age, you must abide by such age limits.
                      </li>
                      <li>
                        VTPartner advises its users that while accessing the web
                        site to follow/abide by the related laws. VTPartner is
                        not responsible for the possible consequences caused by
                        your behaviour / acts during use of web site. VTPartner
                        may, in its sole discretion, refuse the service to
                        anyone at any time.
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    3. USER(S) AGREEMENT
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        User agreement applies to all the users including
                        drivers who use our platform for services provided by
                        VTPartner.
                      </li>
                      <li>
                        User(s) may use our platform solely for their own
                        personal purposes.
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    4. USER(S) AGREEMENT MODIFICATION
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        • VTPartner holds all the rights to change/modify or
                        edit this user agreement on a timely basis in accordance
                        with the requirements of the services provided or in
                        case of the addition of new services, offers, etc. The
                        amended and restated terms and conditions of use shall
                        be effective immediately upon posting. If you do not
                        adhere to the changes, you must stop using the service.
                        Your continuous use of the Services will signify your
                        acceptance of the changed terms and deemed acceptance of
                        the amended Agreement.
                      </li>
                      <li>
                        • By using the Application or the Service, You further
                        agree that:
                        <ul className="list-disc pl-4">
                          <li>
                            (i) You will only use the Service or download the
                            Application for Your sole, personal use and will not
                            resell or assign it to a third party;
                          </li>
                          <li>
                            (ii) You will not use an account that is subject to
                            any rights of a person other than You without
                            appropriate authorization;
                          </li>
                          <li>
                            (iii) You will not use the Service or Site for
                            unlawful purposes;
                          </li>
                          <li>
                            (iv) You will not try to harm the Service, Site, or
                            our network in any way whatsoever;
                          </li>
                          <li>
                            (v) You will provide VTPartner with such information
                            and documents which VTPartner may reasonably
                            request;
                          </li>
                          <li>
                            (vi) You will only use an authorized network to
                            avail the Service;
                          </li>
                          <li>
                            (vii) You are aware that when requesting Services,
                            whether by message, via Site, or calling the call
                            center of VTPartner, standard messaging charges,
                            data charges, and voice charges, as applicable, of
                            Your and Our phone network service providers, will
                            apply;
                          </li>
                          <li>
                            (viii) You are aware of and shall comply with the
                            Information Technology Act, 2000, and the rules,
                            regulations, and guidelines noted thereunder.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    5. SERVICES PROVIDED
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">1. CAB SERVICES</span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Ride Requests and Acceptance
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                <span className="font-semibold">
                                  Requesting a Ride:
                                </span>{" "}
                                Riders can request rides by entering their
                                pickup and drop-off locations. The App will
                                match the request with available Drivers.
                              </li>
                              <li>
                                <span className="font-semibold">
                                  Ride Confirmation:
                                </span>{" "}
                                A Driver’s acceptance of the ride request
                                constitutes a contract to provide the Ride
                                Services to the Rider.
                              </li>
                              <li>
                                <span className="font-semibold">
                                  Cancellation:
                                </span>{" "}
                                Riders may cancel a ride within a certain time
                                window. Cancellations may be subject to fees as
                                described in the App.
                              </li>
                              <li>
                                <span className="font-semibold">
                                  No Guarantee of Availability:
                                </span>{" "}
                                The App does not guarantee that a Driver will
                                always be available to provide Ride Services at
                                the time requested.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Driver and Rider Conduct
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                <span className="font-semibold">
                                  Respectful Behaviour:
                                </span>{" "}
                                Both Riders and Drivers must behave respectfully
                                and refrain from abusive language or actions.
                                Any violations may result in the termination of
                                the account.
                              </li>
                              <li>
                                <span className="font-semibold">
                                  No Smoking or Alcohol:
                                </span>{" "}
                                Smoking and alcohol consumption are prohibited
                                during the ride unless explicitly allowed by law
                                or regulation.
                              </li>
                              <li>
                                <span className="font-semibold">Safety:</span>{" "}
                                Both Riders and Drivers are expected to adhere
                                to all traffic laws and safety regulations.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Rights and Responsibilities of Drivers
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                <span className="font-semibold">
                                  Independent Contractors:
                                </span>{" "}
                                Drivers using the App are independent
                                contractors and not employees of VTPartner.
                                Drivers are responsible for their own taxes,
                                insurance, and other legal obligations.
                              </li>
                              <li>
                                <span className="font-semibold">
                                  Vehicle Standards:
                                </span>{" "}
                                Drivers must ensure that their vehicles meet the
                                company’s safety and cleanliness standards.
                              </li>
                              <li>
                                <span className="font-semibold">
                                  Background Checks:
                                </span>{" "}
                                Drivers are subject to background checks and
                                screenings as required by law or company policy.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Disclaimers and Limitation of Liability
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                <span className="font-semibold">
                                  No Warranty:
                                </span>{" "}
                                The App and the Ride Services are provided "as
                                is" and without warranties of any kind, either
                                express or implied.
                              </li>
                              <li>
                                <span className="font-semibold">
                                  Limitation of Liability:
                                </span>{" "}
                                To the maximum extent permitted by law,
                                VTPartner shall not be liable for any indirect,
                                incidental, or consequential damages arising
                                from the use of the App or the Ride Services,
                                including but not limited to personal injury or
                                property damage.
                              </li>
                              <li>
                                In the event of breakdown of the Vehicle, which
                                is beyond repair, before completion of the Ride,
                                VTPartner on a best effort basis and at its sole
                                discretion may arrange for a Substitute Vehicle
                                for completion of Your Ride to Your destination.
                                However, the arrangement of Substitute Vehicle
                                shall be subject to its availability.
                              </li>
                              <li>
                                The services of goods transport of vehicles by
                                Customers for a point-to-point service, or for
                                time and usage-based service within city limits
                                and outside the city limits, including
                                inter-city all over India.
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    2. GOODS TRANSPORT SERVICES
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">Services Provided</span>
                        <ul className="list-disc pl-4">
                          <li>
                            The App provides a platform for Shippers to request
                            transportation services for goods and for
                            Transporters to accept those requests and perform
                            the transport.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Shipper’s Role:
                            </span>{" "}
                            As a Shipper, you can request transport for goods,
                            specify the type, size, and weight of the goods, and
                            agree to the transport terms.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Transporter’s Role:
                            </span>{" "}
                            As a Transporter, you can view available transport
                            requests and choose to accept the job. You are
                            responsible for providing the vehicle and necessary
                            resources to transport the goods as requested.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Transporter and Shipper Responsibilities
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Transporter’s Responsibilities:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                Transporters are independent contractors, not
                                employees of VTPartner.
                              </li>
                              <li>
                                Transporters are responsible for ensuring that
                                the vehicle used for transport complies with all
                                local laws and regulations.
                              </li>
                              <li>
                                Transporters are responsible for the safe
                                handling of goods during transit and must
                                exercise reasonable care to prevent damage.
                              </li>
                              <li>
                                Transporters must have the necessary insurance
                                coverage as required by law.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Shipper’s Responsibilities:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                Shippers must ensure that the goods are properly
                                packaged and ready for transport.
                              </li>
                              <li>
                                Shippers must provide accurate details about the
                                goods to be transported, including dimensions,
                                weight, and any special requirements.
                              </li>
                              <li>
                                Shippers must be present at the pickup and
                                delivery locations at the agreed times.
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Cancellations and Modifications
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Shipper Cancellations:
                            </span>{" "}
                            Shippers may cancel a transport request before a
                            Transporter accepts the job without penalty.
                            Cancellations after a Transporter has accepted the
                            job may incur a cancellation fee.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Transporter Cancellations:
                            </span>{" "}
                            Transporters may cancel a booking before picking up
                            the goods, but repeated cancellations may lead to
                            account suspension or termination.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Modifications:
                            </span>{" "}
                            Any modifications to the transport agreement (e.g.,
                            changes in the destination, size, or nature of
                            goods) must be agreed upon by both parties.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">Liability</span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Transporter Liability:
                            </span>{" "}
                            The Transporter is responsible for ensuring that
                            goods are safely transported to the destination. The
                            Transporter will be liable for any damage, loss, or
                            delay of goods caused by negligence, improper
                            handling, or failure to comply with applicable laws.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Shipper Liability:
                            </span>{" "}
                            The Shipper is responsible for ensuring that the
                            goods are properly packaged and described. The
                            Shipper is liable for any claims arising from
                            misrepresentation or failure to provide correct
                            information about the goods.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Limitation of Liability:
                            </span>{" "}
                            VTPartner is not liable for any direct, indirect,
                            incidental, or consequential damages resulting from
                            the use of the App or transport services, including
                            but not limited to personal injury, property damage,
                            or delays in delivery.
                          </li>
                          <li>
                            In the event of breakdown of the Vehicle, which is
                            beyond repair, before completion of the Ride,
                            VTPartner on a best effort basis and at its sole
                            discretion may arrange for a Substitute Vehicle for
                            completion of Your Ride to Your destination.
                            However, the arrangement of Substitute Vehicle shall
                            be subject to its availability.
                          </li>
                          <li>
                            The services of goods transport of vehicles by
                            Customers for a point-to-point service, or for time
                            and usage-based service within city limits and
                            outside the city limits, including inter-city all
                            over India.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">Insurance</span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">Transporters:</span>{" "}
                            Transporters are required to have adequate insurance
                            coverage for the transportation of goods, including
                            coverage for loss, damage, and theft during transit.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Goods Coverage:
                            </span>{" "}
                            Shippers may be encouraged to obtain insurance for
                            their goods, especially if the goods are valuable or
                            fragile. VTPartner does not provide insurance for
                            the goods being transported.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    3. PEST CONTROL
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">Services Provided</span>
                        <ul className="list-disc pl-4">
                          <li>
                            VTPartner provides a platform to book pest control
                            services, connecting Users with qualified Service
                            Providers. The Services may include:
                          </li>
                          <ul className="list-disc pl-6">
                            <li>Pest inspections</li>
                            <li>
                              Pest treatments (e.g., termite control, rodent
                              extermination, etc.)
                            </li>
                            <li>Preventative pest control</li>
                            <li>Ongoing maintenance services</li>
                          </ul>
                          <li>
                            The Services offered by Service Providers through
                            the VTPartner App are subject to availability and
                            may vary based on the location and specific needs of
                            the User.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Booking and Payment
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Service Booking:
                            </span>{" "}
                            Users can request pest control services by selecting
                            the desired type of service, specifying the
                            location, and choosing a convenient time for the
                            visit.
                          </li>
                          <li>
                            <span className="font-semibold">Pricing:</span>{" "}
                            Prices for services will vary depending on the type
                            of service requested, the location, the size of the
                            property, and the extent of the pest problem. Price
                            details will be provided before the service is
                            confirmed.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Payment Methods:
                            </span>{" "}
                            Payment will be processed through the App via
                            accepted payment methods (e.g., credit card, debit
                            card, or digital wallet). Payments will be charged
                            after the service is completed, unless otherwise
                            specified.
                          </li>
                          <li>
                            <span className="font-semibold">Service Fees:</span>{" "}
                            VTPartner may charge a service fee, which will be
                            disclosed at the time of booking. Additional charges
                            may apply for additional services or special
                            requests.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Users
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Accurate Information:
                            </span>{" "}
                            You must provide accurate, complete, and up-to-date
                            information regarding the pest control needs,
                            location, and property access for the Service
                            Provider.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Access to Property:
                            </span>{" "}
                            You must ensure that the property is accessible at
                            the time of the appointment. If the Service Provider
                            is unable to access the property or perform the
                            requested services due to user error, a cancellation
                            fee may apply.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Safe Environment:
                            </span>{" "}
                            Ensure that the area to be treated is safe and free
                            from any obstacles or hazards that could prevent the
                            Service Provider from performing the pest control
                            services effectively.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Service Providers
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Licensing and Insurance:
                            </span>{" "}
                            Service Providers are required to hold any necessary
                            licenses, certifications, and insurance required by
                            law to perform pest control services.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Compliance with Standards:
                            </span>{" "}
                            Service Providers must follow safety and
                            environmental guidelines in line with local laws and
                            regulations when providing pest control services.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Service Delivery:
                            </span>{" "}
                            Service Providers must perform the services as
                            requested and outlined during the booking process.
                            They are expected to act professionally, ethically,
                            and with reasonable care.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    4. PUNCTURE TECHNICIAN
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">Services Provided</span>
                        <ul className="list-disc pl-4">
                          <li>
                            VTPartner connects Users with qualified Technicians
                            for puncture repair services. The services offered
                            may include:
                          </li>
                          <ul className="list-disc pl-6">
                            <li>Puncture repair (on-site or in-shop)</li>
                            <li>Flat tire assistance</li>
                            <li>Tire replacement (if requested or required)</li>
                            <li>Tire air pressure checks</li>
                          </ul>
                          <li>
                            Technicians are independent service providers, and
                            their availability to fulfill service requests
                            depends on factors like location, service type, and
                            time.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Booking and Payment
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Service Booking:
                            </span>{" "}
                            Users can request puncture repair services by
                            entering their location and describing the issue
                            with their vehicle’s tire(s). Upon request,
                            Technicians will confirm availability and offer an
                            estimated price.
                          </li>
                          <li>
                            <span className="font-semibold">Pricing:</span>{" "}
                            Prices will vary based on the location, service
                            type, and time of service. All charges, including
                            any applicable taxes or additional service fees,
                            will be clearly disclosed before confirmation of the
                            service booking.
                          </li>
                          <li>
                            <span className="font-semibold">Payment:</span>{" "}
                            Payment for services will be processed through the
                            App using one of the accepted payment methods (e.g.,
                            credit/debit cards, digital wallets, etc.).
                          </li>
                          <li>
                            <span className="font-semibold">Service Fees:</span>{" "}
                            VTPartner may charge a service fee, which will be
                            disclosed at the time of booking. Additional charges
                            may apply for services that exceed the basic
                            puncture repair (e.g., tire replacement, extra time
                            required).
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Users
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Accurate Information:
                            </span>{" "}
                            Users must provide accurate and complete information
                            regarding the issue (e.g., tire puncture details,
                            location, type of vehicle) to ensure the Technician
                            can provide the correct service.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Access to Vehicle:
                            </span>{" "}
                            The User must ensure that the vehicle is accessible
                            and that the Technician can perform the puncture
                            repair at the agreed time and location.
                          </li>
                          <li>
                            <span className="font-semibold">Safety:</span> The
                            User is responsible for ensuring that the location
                            is safe for the Technician to perform the puncture
                            repair. If the location is hazardous, the Technician
                            may cancel the service, and a cancellation fee may
                            apply.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Technicians
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Qualification and Professionalism:
                            </span>{" "}
                            Technicians must be qualified and experienced in
                            puncture repair services and must act professionally
                            at all times when providing services through the
                            App.
                          </li>
                          <li>
                            <span className="font-semibold">Compliance:</span>{" "}
                            Technicians are responsible for complying with all
                            relevant laws, safety regulations, and best
                            practices related to the provision of puncture
                            repair services.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Tools and Equipment:
                            </span>{" "}
                            Technicians are responsible for bringing the
                            necessary tools and equipment to perform puncture
                            repair services unless otherwise stated in the
                            service description.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    5. WATER PURIFIER TECHNICIAN
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">Services Provided</span>
                        <ul className="list-disc pl-4">
                          <li>
                            The App connects Users with Service Providers who
                            offer various water purifier services, including:
                          </li>
                          <ul className="list-disc pl-6">
                            <li>Installation of new water purifiers</li>
                            <li>Regular maintenance and servicing</li>
                            <li>Filter replacement</li>
                            <li>Cleaning and sanitizing of water purifiers</li>
                            <li>Repairs and troubleshooting</li>
                            <li>
                              Purification services (e.g., water filtration or
                              purification systems)
                            </li>
                          </ul>
                          <li>
                            Services may vary based on location, type of service
                            requested, and availability of Service Providers.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Booking and Payment
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Service Booking:
                            </span>{" "}
                            Users can book services by selecting the desired
                            type of service (installation, maintenance, etc.),
                            providing details such as the location, type of
                            water purifier, and preferred appointment time.
                          </li>
                          <li>
                            <span className="font-semibold">Pricing:</span>{" "}
                            Prices for services will vary based on the type of
                            service requested, location, the complexity of the
                            task, and the service provider’s pricing. All fees
                            will be disclosed before the service is confirmed.
                          </li>
                          <li>
                            <span className="font-semibold">Payment:</span>{" "}
                            Payment for services will be processed through the
                            App using one of the accepted payment methods
                            (credit/debit cards, digital wallets, etc.). Payment
                            must be made after the completion of the service,
                            unless otherwise specified.
                          </li>
                          <li>
                            <span className="font-semibold">Service Fees:</span>{" "}
                            VTPartner may charge a service fee, which will be
                            disclosed during the booking process.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Users
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Accurate Information:
                            </span>{" "}
                            Users must provide accurate and complete details
                            about the water purifier and any issues it may have
                            when booking a service.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Access to Property:
                            </span>{" "}
                            The User must ensure that the location is accessible
                            for the Service Provider to perform the requested
                            services. If there is restricted access or if the
                            service cannot be performed due to any reason, the
                            User may incur a cancellation fee.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Safety and Environment:
                            </span>{" "}
                            Users must ensure that the location is safe for the
                            Service Provider to perform the requested work and
                            that the area is free from hazards. Any issues
                            relating to safety or compliance may result in the
                            service being delayed or cancelled.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Service Providers
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Qualifications:
                            </span>{" "}
                            Service Providers must be qualified and experienced
                            in performing the specific services requested by the
                            User (e.g., installation, maintenance, repair of
                            water purifiers).
                          </li>
                          <li>
                            <span className="font-semibold">Compliance:</span>{" "}
                            Service Providers are required to comply with all
                            local laws, health, and safety regulations, and
                            follow industry standards when providing services.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Service Delivery:
                            </span>{" "}
                            Service Providers must deliver services in a
                            professional and timely manner, ensuring quality and
                            compliance with the User's specifications.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Limitation of Liability
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              No Guarantee of Results:
                            </span>{" "}
                            VTPartner does not guarantee that the services
                            provided will fully resolve the issue or meet the
                            User’s expectations. The effectiveness of water
                            purifier services may depend on various factors,
                            including the model of the water purifier and the
                            nature of the problem.
                          </li>
                          <li>
                            <span className="font-semibold">
                              No Responsibility for Damages:
                            </span>{" "}
                            VTPartner is not responsible for any personal
                            injury, property damage, or loss arising from the
                            use of the App or services provided by Service
                            Providers. Users agree to hold VTPartner harmless
                            for any damages or claims.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Service Provider Liability:
                            </span>{" "}
                            Service Providers are responsible for the services
                            they provide, and any damage or liability caused by
                            their actions will be their responsibility.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    6. TV/DISH, WASHING MACHINE, AC TECHNICIAN
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">Services Provided</span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              TV/Dish Services:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>Installation of TVs and satellite dishes.</li>
                              <li>
                                Troubleshooting and repairing TV issues (e.g.,
                                no signal, sound issues).
                              </li>
                              <li>
                                Satellite dish alignment and signal
                                optimization.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Washing Machine Services:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                Installation and setup of washing machines.
                              </li>
                              <li>
                                Repair and troubleshooting of washing machine
                                issues (e.g., leaking, not spinning, not
                                draining).
                              </li>
                              <li>
                                Regular maintenance and servicing (e.g.,
                                cleaning filters, checking hoses).
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">AC Services:</span>
                            <ul className="list-disc pl-6">
                              <li>
                                Installation of air conditioners (window and
                                split units).
                              </li>
                              <li>
                                Repair services for malfunctioning air
                                conditioners (e.g., not cooling, leaks, not
                                turning on).
                              </li>
                              <li>
                                AC maintenance (e.g., cleaning filters, checking
                                refrigerant levels).
                              </li>
                            </ul>
                          </li>
                          <li>
                            Services may vary based on location, the type of
                            service requested, and the availability of
                            Technicians.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Booking and Payment
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Service Booking:
                            </span>{" "}
                            Users can request services through the App by
                            selecting the type of service (installation, repair,
                            maintenance, etc.), providing necessary details such
                            as location, type of equipment, and preferred
                            appointment time.
                          </li>
                          <li>
                            <span className="font-semibold">Pricing:</span> The
                            price for services will vary depending on the type
                            of service, complexity, and the specific Technician.
                            Pricing details will be displayed before
                            confirmation of the service booking.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Payment Methods:
                            </span>{" "}
                            Payment for services will be processed through the
                            App using one of the accepted payment methods (e.g.,
                            credit/debit card, digital wallets, etc.).
                          </li>
                          <li>
                            <span className="font-semibold">Service Fees:</span>{" "}
                            VTPartner may charge a service fee, which will be
                            disclosed during the booking process. Additional
                            charges may apply if additional services are
                            requested or required.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Users
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Accurate Information:
                            </span>{" "}
                            Users must provide accurate and complete details
                            about the service they require, including the type
                            of TV/Dish system, issues, and location to help
                            Technicians prepare adequately for the service.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Access to Property:
                            </span>{" "}
                            The User must ensure that the property is accessible
                            to the Technician at the agreed time. If the
                            Technician is unable to access the location or
                            perform the requested service due to User-related
                            issues, a cancellation or rescheduling fee may
                            apply.
                          </li>
                          <li>
                            <span className="font-semibold">Safety:</span> Users
                            are responsible for ensuring the work area is safe
                            for the Technician to perform their tasks. The area
                            should be free of hazards or obstacles that may
                            hinder the service.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Technicians
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Qualifications:
                            </span>{" "}
                            Technicians must be qualified and skilled in TV/Dish
                            installations, repairs, and maintenance. They should
                            have the necessary experience and certifications to
                            provide safe and reliable services.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Service Delivery:
                            </span>{" "}
                            Technicians must provide services in a professional,
                            timely, and efficient manner, ensuring high-quality
                            work that meets industry standards.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Equipment and Tools:
                            </span>{" "}
                            Technicians are responsible for bringing the
                            necessary tools, equipment, and materials required
                            to perform the requested services.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Cancellations and Modifications
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              User Cancellations:
                            </span>{" "}
                            Users can cancel or reschedule a service request
                            without penalty up to a certain time before the
                            Technician arrives (e.g., 24 hours prior). If the
                            service is cancelled after the Technician has
                            arrived, a cancellation fee may apply.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Technician Cancellations:
                            </span>{" "}
                            If the Technician is unable to fulfil a service (due
                            to illness, emergency, or other reasons), VTPartner
                            will notify the User and assist in rescheduling or
                            finding an alternative Technician.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Modifications:
                            </span>{" "}
                            If Users want to modify the service request (e.g.,
                            adding extra tasks or services), they should inform
                            the Technician in advance. Additional charges may
                            apply for modifications.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Limitation of Liability
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              No Guarantee of Results:
                            </span>{" "}
                            VTPartner does not guarantee that the services
                            provided will fully resolve all issues or meet User
                            expectations. The effectiveness of TV/Dish services
                            depends on the nature of the problem, the type of
                            equipment, and other factors.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Liability for Damages:
                            </span>{" "}
                            VTPartner is not liable for any personal injury,
                            property damage, or loss arising from the use of the
                            App or the services provided by Technicians. Users
                            agree to hold VTPartner harmless for any claims or
                            damages that arise from the service.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Technician Liability:
                            </span>{" "}
                            Technicians are responsible for their own work. If
                            damage occurs due to the Technician's negligence or
                            misconduct, they may be held liable.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">Insurance</span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Technician Insurance:
                            </span>{" "}
                            Technicians must maintain appropriate insurance
                            coverage, including liability and property damage
                            insurance, to cover any potential accidents or
                            damage caused during the provision of services.
                          </li>
                          <li>
                            <span className="font-semibold">
                              User Insurance:
                            </span>{" "}
                            Users are encouraged to have appropriate insurance
                            coverage for their property, including TV systems,
                            satellite dishes, and any related equipment.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    7. CARPENTER, PLUMBER, PAINTER, ELECTRICIAN
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">Services Provided</span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Carpenter Services:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>Furniture installation and assembly.</li>
                              <li>
                                Woodwork (e.g., shelves, cabinets, doors,
                                windows).
                              </li>
                              <li>Custom wood furniture design and repair.</li>
                              <li>
                                Door and window fitting, repairs, and
                                adjustments.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Plumber Services:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                Installation and repair of plumbing systems
                                (e.g., pipes, faucets, water heaters).
                              </li>
                              <li>
                                Unclogging drains, repairing leaks, and
                                installing sanitary fixtures.
                              </li>
                              <li>
                                Regular maintenance of plumbing systems to
                                prevent issues.
                              </li>
                              <li>Water heater repairs and installations.</li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Painter Services:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>Interior and exterior painting.</li>
                              <li>Wall preparation and priming.</li>
                              <li>Wallpaper installation and removal.</li>
                              <li>
                                Surface cleaning and painting of various
                                surfaces.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Electrician Services:
                            </span>
                            <ul className="list-disc pl-6">
                              <li>
                                Installation and repair of electrical systems,
                                wiring, outlets, and circuits.
                              </li>
                              <li>Light fixture installation and repair.</li>
                              <li>
                                Troubleshooting and fixing electrical faults.
                              </li>
                              <li>
                                Installation of electrical appliances (e.g., AC,
                                ceiling fans, water heaters).
                              </li>
                            </ul>
                          </li>
                          <li>
                            Services may vary based on location, type of service
                            requested, and availability of Technicians.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Booking and Payment
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Service Booking:
                            </span>{" "}
                            Users can request services through the App by
                            selecting the type of service (carpentry, plumbing,
                            painting, electrical), providing necessary details
                            such as location, type of task, and preferred
                            appointment time.
                          </li>
                          <li>
                            <span className="font-semibold">Pricing:</span> The
                            price for services will vary depending on the type
                            of service, complexity, and the specific Technician.
                            Pricing details will be disclosed before
                            confirmation of service booking.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Payment Methods:
                            </span>{" "}
                            Payment for services will be processed through the
                            App using one of the accepted payment methods (e.g.,
                            credit/debit card, digital wallets, etc.).
                          </li>
                          <li>
                            <span className="font-semibold">Service Fees:</span>{" "}
                            VTPartner may charge a service fee, which will be
                            disclosed during the booking process. Additional
                            charges may apply if additional services are
                            requested or required.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Users
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Accurate Information:
                            </span>{" "}
                            Users must provide accurate and complete details
                            about the service they require, including the type
                            of service (carpentry, plumbing, painting, or
                            electrical), location, and any issues or
                            specifications to help Technicians prepare
                            adequately.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Access to Property:
                            </span>{" "}
                            Users must ensure the property is accessible to the
                            Technician at the agreed time. If the Technician is
                            unable to access the location or perform the
                            requested service due to User-related issues, a
                            cancellation or rescheduling fee may apply.
                          </li>
                          <li>
                            <span className="font-semibold">Safety:</span> Users
                            are responsible for ensuring that the work area is
                            safe and that the space is free of hazards or
                            obstacles that may hinder the service.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Responsibilities of Technicians
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Qualifications:
                            </span>{" "}
                            Technicians must be qualified and skilled in
                            providing the respective services (carpentry,
                            plumbing, painting, or electrical). They must have
                            the necessary experience, certifications, and
                            licenses to perform the services safely and
                            efficiently.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Service Delivery:
                            </span>{" "}
                            Technicians must deliver services in a professional,
                            timely, and efficient manner, ensuring high-quality
                            work that meets industry standards.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Equipment and Tools:
                            </span>{" "}
                            Technicians are responsible for bringing the
                            necessary tools, equipment, and materials required
                            to perform the requested services.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Cancellations and Modifications
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              User Cancellations:
                            </span>{" "}
                            Users can cancel or reschedule a service request
                            without penalty up to a certain time before the
                            Technician arrives (e.g., 24 hours in advance). If
                            the service is cancelled after the Technician has
                            arrived, a cancellation fee may apply.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Technician Cancellations:
                            </span>{" "}
                            If the Technician is unable to fulfil a service (due
                            to illness, emergency, or other reasons), VTPartner
                            will notify the User and assist in rescheduling or
                            finding an alternative Technician.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Modifications:
                            </span>{" "}
                            If Users want to modify the service request (e.g.,
                            adding extra tasks or services), they should inform
                            the Technician in advance. Additional charges may
                            apply for modifications.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Limitation of Liability
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              No Guarantee of Results:
                            </span>{" "}
                            VTPartner does not guarantee that the services
                            provided will fully resolve all issues or meet User
                            expectations. The effectiveness of services depends
                            on the nature of the problem, the type of equipment,
                            and other factors.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Liability for Damages:
                            </span>{" "}
                            VTPartner is not liable for any personal injury,
                            property damage, or loss arising from the use of the
                            App or the services provided by Technicians. Users
                            agree to hold VTPartner harmless for any claims or
                            damages that arise from the service.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Technician Liability:
                            </span>{" "}
                            Technicians are responsible for their own work. If
                            damage occurs due to the Technician's negligence or
                            misconduct, they may be held liable.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>

                  <span className="font-semibold text-sm mt-4">6. PAYMENT</span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">
                          Pricing and Rate Adjustments
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            The rates for vehicle rentals and other services may
                            be subject to regular updates and modifications at
                            the discretion of VT Partner Trans Pvt Ltd. Any
                            changes will be communicated promptly to users via
                            the app, notifications, or other appropriate
                            channels.
                          </li>
                          <li>
                            Payments to and from service providers and customers
                            can be made via cash, online payment options (UPI,
                            credit card, debit card), or other mutually agreed
                            methods.
                          </li>
                          <li>
                            Payment schedules, advances, and terms can be
                            adjusted per agreement between the parties to ensure
                            smooth and flexible transactions.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Invoicing and Receipts
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            Invoices and receipts for services will be generated
                            automatically through the app to ensure transparency
                            and ease of record-keeping for both service
                            providers and customers.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>

                  <span className="font-semibold text-sm mt-4">8. REFUND</span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    Refund policies for VTPartner can vary significantly
                    depending on the type of service, the company’s terms and
                    conditions, and the region or country in which they operate.
                    However, there are some general principles that VTPartner
                    follows when handling refund requests.
                    <ul className="list-inside pl-4">
                      <li>
                        <span className="font-semibold">
                          Taxis and Ride-Hailing
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Refunds for Cancellations by the Company:
                            </span>{" "}
                            If VTPartner cancels a booking (e.g., due to
                            technical issues, availability problems), a refund
                            is typically offered.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Refunds for Voluntary Cancellations:
                            </span>{" "}
                            Cancellations made by the rider often incur a
                            cancellation fee, particularly if done after a
                            certain grace period. Refunds for the fare may not
                            be possible if the ride was completed, but if it’s
                            charged incorrectly or if the service was subpar,
                            riders can request a refund.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Refund Process:
                            </span>{" "}
                            Refunds for incorrect charges or disputes with
                            services (e.g., overcharging, no-show) are often
                            processed quickly, typically within 1–5 business
                            days.
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Shipping and Freight Services
                        </span>
                        <ul className="list-disc pl-4">
                          <li>
                            <span className="font-semibold">
                              Refunds for Cancellations by the Company:
                            </span>{" "}
                            If there’s a delay in delivery due to the fault of
                            the carrier (e.g., lost items, missed delivery
                            deadlines), VTPartner provide a refund or credit for
                            the shipping cost.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Refunds for Voluntary Cancellations:
                            </span>{" "}
                            Freight services usually only allow refunds for
                            shipments that are cancelled before the package is
                            shipped. After shipment, refunds are typically not
                            issued unless there is a significant issue (such as
                            damage to goods during transit) based on the
                            insurance claim.
                          </li>
                          <li>
                            <span className="font-semibold">Change Fees:</span>{" "}
                            VTPartner refunds or allows changes to travel dates,
                            but with associated change fees. These fees are
                            typically deducted from the refund.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Time Limit for Refund Requests:
                            </span>{" "}
                            Customers are required to make refund requests
                            within a specific time frame (e.g., within 30 days
                            of travel or shipment), or else the request may be
                            denied.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Refund Processing Time:
                            </span>{" "}
                            Refunds can take anywhere from a few days to several
                            weeks depending on applicable law, the method of
                            payment, and the complexity of the issue.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Refund Process:
                            </span>{" "}
                            Refunds are typically processed within 7–10 business
                            days but can take longer depending on the complexity
                            of the issue.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    9. INDEMNIFICATION
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    You agree to indemnify, defend, and hold harmless VTPartner,
                    its affiliates, employees, agents, and licensors from any
                    claims, damages, losses, or expenses arising out of your use
                    of the App or your violation of these Terms.
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    10. FARE CALCULATION AND DISPUTES
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    Trip fares will be calculated by the app’s integrated
                    software system based on predefined rates, including
                    variables such as distance, duration, vehicle type, and
                    additional service requirements, as mentioned below:
                    <ul className="list-disc pl-6 pt-2">
                      <li>Minimum fare</li>
                      <li>Base fare</li>
                      <li>Pre-wait charges (if any)</li>
                      <li>Applicable taxes</li>
                      <li>
                        Per kilometre fare (based on the total distance of the
                        ride)
                      </li>
                      <li>
                        Per minute charges (based on the time taken to complete
                        the ride)
                      </li>
                      <li>
                        Third-party charges like insurance premium (if
                        applicable)
                      </li>
                      <li>Peak charges (when applicable)</li>
                      <li>Past dues (if any)</li>
                    </ul>
                    <p className="pt-2">
                      * Both fares and peak charges may vary based on various
                      market dynamics such as cost of living, fuel pricing,
                      vehicle maintenance costs, interest rates, demand and
                      supply situation, etc.
                    </p>
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    11. TERMINATION OF ACCESS
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    • <strong>Termination by VTPartner:</strong> VTPartner
                    reserves the right to suspend or terminate the account of
                    any User (Shipper or Transporter) at its discretion for
                    violations of these Terms or other misconduct. <br />•{" "}
                    <strong>Termination by User:</strong> Users can deactivate
                    their account at any time by following the procedures in the
                    App or contacting customer support.
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    12. HYPERLINKING TO OUR CONTENT
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <strong>A.</strong> The following organizations may link to
                    our website without prior written approval:
                    <ul className="list-disc pl-6 pt-2">
                      <li>Government agencies</li>
                      <li>Search engines</li>
                      <li>News organizations</li>
                      <li>
                        Online directory distributors when they list us in the
                        directory may link to our Web site in the same manner as
                        they hyperlink to the Web sites of other listed
                        businesses
                      </li>
                      <li>
                        Systemwide Accredited Businesses except soliciting
                        non-profit organizations, charity shopping malls, and
                        charity fundraising groups which may not hyperlink to
                        our Web site.
                      </li>
                    </ul>
                    <p className="pt-2">
                      These organizations may link to our home page,
                      publications, or other web site information so long as the
                      link: (a) is not misleading; (b) does not falsely imply
                      sponsorship, endorsement, or approval of the linking party
                      and its products or services; and (c) fits within the
                      context of the linking party's site.
                    </p>
                    <strong>B.</strong> We may consider and approve in our sole
                    discretion other link requests from the following types of
                    organizations:
                    <ul className="list-disc pl-6 pt-2">
                      <li>
                        Commonly-known consumer and/or business information
                        sources such as Chambers of Commerce, American
                        Automobile Association, AARP, and Consumers Union
                      </li>
                      <li>Dot.com community sites</li>
                      <li>
                        Associations or other groups representing charities,
                        including charity giving sites
                      </li>
                      <li>Online directory distributors</li>
                      <li>Internet portals</li>
                      <li>
                        Accounting, law and consulting firms whose primary
                        clients are businesses
                      </li>
                      <li>Educational institutions and trade associations</li>
                    </ul>
                    <p className="pt-2">
                      We will approve link requests from these organizations if
                      we determine that: (a) the link would not reflect
                      unfavorably on us or our accredited businesses; (b) the
                      organization does not have an unsatisfactory record with
                      us; (c) the benefit to us from the visibility associated
                      with the hyperlink outweighs the absence of VT PARTNER
                      TRANS PVT LTD; and (d) where the link is in the context of
                      general resource information or is consistent with
                      editorial content in a newsletter or similar product
                      furthering the mission of the organization.
                    </p>
                    <strong>C.</strong> These organizations may link to our home
                    page, publications, or other Web site information so long as
                    the link: (a) is not misleading; (b) does not falsely imply
                    sponsorship, endorsement, or approval of the linking party
                    and its products or services; and (c) fits within the
                    context of the linking party's site.
                    <p className="pt-2">
                      If you are among the organizations listed above and are
                      interested in linking to our website, you must notify us
                      by sending an e-mail to vtpartner7@gmail.com. Please
                      include your name, organization name, contact information
                      (phone number and/or e-mail address), the URL of your
                      site, a list of URLs from which you intend to link to our
                      Web site, and a list of the URL(s) on our site to which
                      you would like to link. Allow 2–3 weeks for a response.
                    </p>
                    <strong>D.</strong> Approved organizations may hyperlink to
                    our Web site as follows:
                    <ul className="list-disc pl-6 pt-2">
                      <li>By use of our corporate name</li>
                      <li>
                        By use of the uniform resource locator (Web address)
                        being linked to
                      </li>
                      <li>
                        By use of any other description of our Web site or
                        material being linked to that makes sense within the
                        context and format of content on the linking party's
                        site
                      </li>
                    </ul>
                    <p className="pt-2">
                      No use of VT PARTNER TRANS PVT LTD's logo or other artwork
                      will be allowed for linking absent a trademark license
                      agreement.
                    </p>
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    13. PRIVACY AND DATA PROTECTION
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    By using the App, you consent to the collection, storage,
                    and processing of your personal data in accordance with our
                    Privacy Policy. The data we collect may include personal
                    details (name, address, contact information), location data,
                    payment information, and service history, which will be used
                    to provide services and improve the App experience.
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    14. MODIFICATION OF TERMS
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    VTPartner reserves the right to modify or update these Terms
                    at any time. Any changes will be posted within the App, and
                    Users will be notified of significant changes. Continued use
                    of the App after changes to the Terms constitutes acceptance
                    of the updated Terms.
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    15. IFRAMES
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    Without prior approval and express written permission, you
                    may not create frames around our Web pages or use other
                    techniques that alter in any way the visual presentation or
                    appearance of our website.
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    16. CONTENT LIABILITY
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    We shall have no responsibility or liability for any content
                    appearing on your website. You agree to indemnify and defend
                    us against all claims arising out of or based upon your
                    website. No link(s) may appear on any page on your website
                    or within any context containing content or materials that
                    may be interpreted as libelous, obscene, criminal, or which
                    infringes, violates, or advocates the infringement or
                    violation of any third-party rights.
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    17. RESERVATION OF RIGHTS
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    We reserve the right at any time and in its sole discretion
                    to request that you remove all links or any particular link
                    to our website. You agree to immediately remove all links to
                    our website upon such request. We also reserve the right to
                    amend these terms of service and its linking policy at any
                    time. By continuing to link to our website, you agree to be
                    bound to and abide by these linking terms of service.
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    18. REMOVAL OF LINKS FROM OUR WEBSITE/APP
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    If you find any link on our website or any linked website
                    objectionable for any reason, you may contact us about this.
                    We will consider requests to remove links but will have no
                    obligation to do so or to respond directly to you. <br />
                    Whilst we endeavor to ensure that the information on this
                    website is correct, we do not warrant its completeness or
                    accuracy; nor do we commit to ensuring that the website
                    remains available or that the material on the website is
                    kept up to date.
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    19. DISCLAIMER
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    To the maximum extent permitted by applicable law, we
                    exclude all representations, warranties, and conditions
                    relating to our website and the use of this website
                    (including, without limitation, any warranties implied by
                    law in respect of satisfactory quality, fitness for purpose,
                    and/or the use of reasonable care and skill). Nothing in
                    this disclaimer will:
                    <ol className="list-decimal pl-6 pt-2">
                      <li>
                        Limit or exclude our or your liability for death or
                        personal injury resulting from negligence;
                      </li>
                      <li>
                        Limit or exclude our or your liability for fraud or
                        fraudulent misrepresentation;
                      </li>
                      <li>
                        Limit any of our or your liabilities in any way that is
                        not permitted under applicable law;
                      </li>
                      <li>
                        Exclude any of our or your liabilities that may not be
                        excluded under applicable law.
                      </li>
                    </ol>
                    The limitations and exclusions of liability set out in this
                    Section and elsewhere in this disclaimer: (a) are subject to
                    the preceding paragraph; and (b) govern all liabilities
                    arising under the disclaimer or in relation to the subject
                    matter of this disclaimer, including liabilities arising in
                    contract, in tort (including negligence), and for breach of
                    statutory duty.
                    <p className="pt-2">
                      To the extent that the website and the information and
                      services on the website are provided free of charge, we
                      will not be liable for any loss or damage of any nature.
                    </p>
                  </p>

                  <span className="font-semibold text-sm mt-4">
                    20. CONTACT INFORMATION
                  </span>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    If you have any questions or concerns about these Terms, the
                    App, or our services, please contact us at:
                  </p>
                  <p className="text-gray-700 text-xs leading-6 pt-2">
                    <strong>VT PARTNER TRANS PVT LTD</strong>
                    <br />
                    Plot No- PAP -A45 Near Mahindra gate no -02 CHAKAN MIDC
                    Nighoje, Pune-410501
                    <br />
                    <strong>Email:</strong> info@vtpartner.in
                    <br />
                    <strong>Phone:</strong> [+91-]
                  </p>
                  <span className="font-semibold text-sm mt-4">
                    21. MISCELLANEOUS
                  </span>
                  <ul className="text-gray-700 text-xs leading-6 pt-2">
                    <li>
                      <strong>Entire Agreement:</strong> These Terms constitute
                      the entire agreement between you and VTPartner regarding
                      the use of the App and services.
                    </li>
                    <li>
                      <strong>Severability:</strong> If any provision of these
                      Terms is found to be invalid or unenforceable, the
                      remaining provisions will remain in full force and effect.
                    </li>
                    <li>
                      <strong>Force Majeure:</strong> VTPartner shall not be
                      liable for any failure or delay in performing services
                      caused by events beyond its reasonable control, including
                      but not limited to natural disasters, technical failures,
                      or strikes.
                    </li>
                    <li>
                      <strong>Responsibility:</strong> VTPartner bears no
                      responsibility and liability for delays and losses
                      suffered by You or caused to You as a consequence of the
                      breakdown of the Vehicle or the Substitute Vehicle.
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditionsCard;
