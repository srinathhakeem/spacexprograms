import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: [],
      launchYears: [],
      filteredResponse: [],
      selectedYear: null,
      launched: null,
      landing: null,
    };
  }

  componentDidMount() {
    axios.get('https://api.spacexdata.com/v3/launches?limit=100')
    .then((response) => {
      const availableLaunchYears = response.data.map((item) => item.launch_year);
      this.setState({ launchYears: [...new Set(availableLaunchYears)], apiData: response.data, filteredResponse: response.data })
    })
    .catch((error) => console.log(error));
  }

  filterValue(year, launched, landing) {
    let filteredResponse;
    if (year !== null) {
      filteredResponse = this.state.apiData.filter((item) => item.launch_year === year);
    }
    if (launched !== null) {
      const data = filteredResponse ? filteredResponse : this.state.apiData;
      filteredResponse = data.filter((item) => item.launch_success === (launched === 'TRUE'));
    }
    if (landing !== null) {
      const data = filteredResponse ? filteredResponse : this.state.apiData;
      filteredResponse = data.filter((item) => item.launch_landing === (landing === 'TRUE'));
    }
    this.setState({ filteredResponse: filteredResponse });
  }

  onYearSelect (year) {
    this.setState({ selectedYear: year });
    this.filterValue(year, this.state.launched, this.state.landing);
  }

  onLaunchSelect(val) {
    this.setState({ launched: val });
    this.filterValue(this.state.selectedYear, val, this.state.landing);
  } 
  
  onLandingSelect(val) {
    // this.setState({ landing: val });
    // this.filterValue(this.state.selectedYear, this.state.launched, val);
  }

  render() {
    console.log(this.state);
    const { launchYears, filteredResponse, selectedYear, launched, landing } = this.state;
    return (
      <div className="container">
        <Row>
          <Col xs={12}><strong>SpaceX Launch Programs</strong><br /><br /></Col>
        </Row>
        <Row>
          <Col xs={12} lg={2} md={3}>
            <div className="filter-grid">
              <strong>Filters</strong><br />
              <div className="filter-label">Launch Years</div>
              <Row>
                {launchYears.map((item) => (
                  <Col xs={6}>
                    <button className={`filter-label-button ${selectedYear === item ? 'selected' : ''}`} onClick={() => this.onYearSelect(item)}>{item}</button>
                  </Col>
                ))}
              </Row>
              <div className="filter-label">Successful Launch</div>
              <Row>
                <Col xs={6}>
                  <button className={`filter-label-button ${launched === 'TRUE' ? 'selected' : ''}`} onClick={() => this.onLaunchSelect('TRUE')}>True</button>
                </Col>
                <Col xs={6}>
                  <button  className={`filter-label-button ${launched === 'FALSE' ? 'selected' : ''}`} onClick={() => this.onLaunchSelect('FALSE')}>False</button>
                </Col>
              </Row>
              <div className="filter-label">Successful Landing</div>
              <Row>
                <Col xs={6}>
                  <button className={`filter-label-button ${landing === 'TRUE' ? 'selected' : ''}`} onClick={() => this.onLandingSelect('TRUE')}>True</button>
                </Col>
                <Col xs={6}>
                  <button className={`filter-label-button ${landing === 'FALSE' ? 'selected' : ''}`} onClick={() => this.onLandingSelect('FALSE')}>False</button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={12} lg={10} md={9}>
            <Row>
              {filteredResponse.length === 0 && (<div style={{ color: 'red', fontSize: '30px', fontWeight: 'bold' }}>No Records found for the selection</div>)}
              {filteredResponse.length > 0 && filteredResponse.map((item) => (
                <Col xs={12} lg={3} md={4}>
                  <div className="view-grid">
                    <div style={{ textAlign: 'center' }}>
                      <img src={item.links.mission_patch_small} alt={item.mission_name} width="70%" style={{ padding: '12px', background: 'lightgray' }} />
                    </div>
                    <div>
                      <p style={{ color: 'blue' }}>{item.mission_name} #{item.flight_number}</p>
                      {item.mission_id && item.mission_id.length > 0 && (
                        <div>
                          <p><strong>Mission Ids:</strong></p>
                          <ul>
                            {item.mission_id.map((id) => (
                              <li>{id}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p><strong>Launch Year:</strong>&nbsp;{item.launch_year}</p>
                      <p><strong>Successful Launch:</strong>&nbsp;{item.launch_success ? 'true' : 'false'}</p>
                      <p><strong>Successful Landing:</strong>&nbsp;{item.launch_landing}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;


