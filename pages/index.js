import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import Campaign from '../ethereum/campaign';

class CampaignIndex extends Component {
  //NextJs exclusive method -- called when loading code on Next server
  //Ideal place for data loading info that will need to be displayed on the screen
  //static (req. by NextJs) allows Next to run the method without having to render the component
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    const summaries = await Promise.all(
      campaigns.map(address => {
        const campaign = Campaign(address);
        return campaign.methods.getSummary().call();
      })
    );
    return { campaigns, summaries };
  }

  renderCampaigns() {
    const items = this.props.summaries.map((summary, index) => {
      const address = this.props.campaigns[index];
      return {
        header: (
         <Link route={`/campaigns/${address}`}>
            <a><h3>{summary[0]}</h3></a>
          </Link>
        ),
        description: summary[1], //description
        meta: 'Goal: ' + summary[2] + ' Eth', //goal
        fluid: true
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add"
                primary/>
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
